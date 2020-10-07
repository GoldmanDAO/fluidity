import yargs from "yargs";
import fs from "fs";
import dotenv from "dotenv";
import "colors";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";

import { Decimal, Difference } from "@liquity/decimal";
import { Trove, TroveWithPendingRewards } from "@liquity/lib-base";
import { deploymentOnNetwork, EthersLiquity as Liquity } from "@liquity/lib-ethers";
import { SubgraphLiquity } from "@liquity/lib-subgraph";

import {
  checkSubgraph,
  checkTroveOrdering,
  connectUsers,
  createRandomWallets,
  getListOfTroveOwners,
  getListOfTroves,
  listDifference,
  shortenAddress
} from "./utils";
import {
  closeTrove,
  liquidateTroves,
  openRandomTrove,
  redeemRandomAmount,
  setRandomPrice
} from "./actions";

dotenv.config();

const provider = new JsonRpcProvider("http://localhost:8545");
const subgraph = new SubgraphLiquity("http://localhost:8000/subgraphs/name/liquity/subgraph");

const deployer = process.env.DEPLOYER_PRIVATE_KEY
  ? new Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider)
  : Wallet.createRandom().connect(provider);

const funder = new Wallet(
  "0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7",
  provider
);

const deployment = deploymentOnNetwork["dev"];
if (!deployment) {
  throw new Error("Must deploy to dev chain first");
}

const { addresses } = deployment;

yargs
  .scriptName("yarn fuzzer")

  .command(
    "warzone",
    "Create lots of Troves.",
    {
      troves: {
        alias: "n",
        default: 1000,
        description: "Number of troves to create"
      }
    },
    async ({ troves }) => {
      const deployerLiquity = await Liquity.connect(addresses, deployer);

      const price = await deployerLiquity.getPrice();
      const priceAsNumber = parseFloat(price.toString(4));

      let numberOfTroves = await deployerLiquity.getNumberOfTroves();

      for (let i = 1; i <= troves; ++i) {
        const user = Wallet.createRandom().connect(provider);
        const userAddress = await user.getAddress();
        const collateral = 999 * Math.random() + 1;
        const debt = (priceAsNumber * collateral) / (3 * Math.random() + 1.11);

        const liquity = await Liquity.connect(addresses, user);

        await funder.sendTransaction({
          to: userAddress,
          value: Decimal.from(collateral).bigNumber
        });

        await liquity.openTrove(
          new Trove({ collateral, debt }),
          { price, numberOfTroves },
          { gasPrice: 0 }
        );

        numberOfTroves++;

        if (i % 4 === 0) {
          await liquity.depositQuiInStabilityPool(debt);
        }

        if (i % 10 === 0) {
          console.log(`Created ${i} Troves.`);
        }

        //await new Promise(resolve => setTimeout(resolve, 4000));
      }
    }
  )

  .command(
    "chaos",
    "Try to break Liquity by randomly interacting with it.",
    {
      users: {
        alias: "u",
        default: 40,
        description: "Number of users to spawn"
      },
      rounds: {
        alias: "n",
        default: 25,
        description: "How many times each user should interact with Liquity"
      },
      subgraph: {
        alias: "g",
        default: false,
        description: "Check after every round that subgraph data matches layer 1"
      }
    },
    async ({ rounds: numberOfRounds, users: numberOfUsers, subgraph: shouldCheckSubgraph }) => {
      const randomUsers = createRandomWallets(numberOfUsers, provider);

      const [deployerLiquity, funderLiquity, ...randomLiquities] = await connectUsers(
        [deployer, funder, ...randomUsers],
        addresses
      );

      let price = await deployerLiquity.getPrice();
      let numberOfTroves = await deployerLiquity.getNumberOfTroves();

      let funderTrove = await funderLiquity.getTrove();
      if (funderTrove.isEmpty) {
        await funderLiquity.openTrove(new Trove({ collateral: 10000, debt: 1000000 }), {
          price,
          numberOfTroves
        });

        numberOfTroves++;
      }

      let totalNumberOfLiquidations = 0;

      let previousListOfTroves:
        | (readonly [string, TroveWithPendingRewards])[]
        | undefined = undefined;

      for (let i = 1; i <= numberOfRounds; ++i) {
        console.log();
        console.log(`// Round #${i}`);

        price = await setRandomPrice(deployerLiquity, price);

        const numberOfLiquidatedTroves = await liquidateTroves(deployerLiquity, 30);
        totalNumberOfLiquidations += numberOfLiquidatedTroves;
        numberOfTroves -= numberOfLiquidatedTroves;

        for (const liquity of randomLiquities) {
          if (Math.random() < 0.5) {
            const trove = await liquity.getTrove();

            if (trove.isEmpty) {
              await openRandomTrove(liquity, funder, price, numberOfTroves);
              numberOfTroves++;
            } else {
              await closeTrove(liquity, trove, funderLiquity, price, numberOfTroves);
              numberOfTroves--;
            }
          } else {
            await redeemRandomAmount(liquity, funderLiquity, price, numberOfTroves);
          }

          const quiBalance = await liquity.getQuiBalance();
          await liquity.sendQui(funderLiquity.userAddress!, quiBalance, { gasPrice: 0 });

          const listOfTroves = await getListOfTroves(deployerLiquity);
          await checkTroveOrdering(deployerLiquity, price, listOfTroves, previousListOfTroves);
          previousListOfTroves = listOfTroves;
        }

        if (shouldCheckSubgraph) {
          const blockNumber = await provider.getBlockNumber();
          await subgraph.waitForBlock(blockNumber);
          await checkSubgraph(subgraph, deployerLiquity);
        }
      }

      const total = await funderLiquity.getTotal();
      numberOfTroves = await funderLiquity.getNumberOfTroves();

      console.log();
      console.log(`Number of Troves: ${numberOfTroves}`);
      console.log(`Total collateral: ${total.collateral}`);

      fs.appendFileSync(
        "chaos.csv",
        `${numberOfTroves},${totalNumberOfLiquidations},${total.collateral}\n`
      );
    }
  )

  .command(
    "order",
    "End chaos and restore order by liquidating every Trove except the Funder's.",
    {},
    async () => {
      const [deployerLiquity, funderLiquity] = await connectUsers([deployer, funder], addresses);

      const initialPrice = await deployerLiquity.getPrice();
      const initialNumberOfTroves = await funderLiquity.getNumberOfTroves();

      let [[firstTroveOwner]] = await funderLiquity.getFirstTroves(0, 1);

      if (firstTroveOwner !== funderLiquity.userAddress) {
        let trove = await funderLiquity.getTrove();

        if (trove.debt.isZero) {
          await funderLiquity.borrowQui(1, {
            trove,
            price: initialPrice,
            numberOfTroves: initialNumberOfTroves
          });

          trove = await funderLiquity.getTrove();
        }

        await funderLiquity.repayQui(trove.debt, {
          trove,
          price: initialPrice,
          numberOfTroves: initialNumberOfTroves
        });
      }

      [[firstTroveOwner]] = await funderLiquity.getFirstTroves(0, 1);

      if (firstTroveOwner !== funderLiquity.userAddress) {
        throw new Error("didn't manage to hoist Funder's Trove to head of SortedCDPs");
      }

      await deployerLiquity.setPrice(0.001);

      let numberOfTroves: number;
      while ((numberOfTroves = await funderLiquity.getNumberOfTroves()) > 1) {
        const numberOfTrovesToLiquidate = numberOfTroves > 10 ? 10 : numberOfTroves - 1;

        console.log(`${numberOfTroves} Troves left.`);
        await funderLiquity.liquidateUpTo(numberOfTrovesToLiquidate);
      }

      await deployerLiquity.setPrice(initialPrice);

      if ((await funderLiquity.getNumberOfTroves()) !== 1) {
        throw new Error("didn't manage to liquidate every Trove");
      }

      const funderTrove = await funderLiquity.getTrove();
      const total = await funderLiquity.getTotal();

      const collateralDifference = Difference.between(total.collateral, funderTrove.collateral);
      const debtDifference = Difference.between(total.debt, funderTrove.debt);

      console.log();
      console.log("Discrepancies:");
      console.log(`Collateral: ${collateralDifference}`);
      console.log(`Debt: ${debtDifference}`);

      fs.appendFileSync(
        "chaos.csv",
        `${numberOfTroves},` +
          `${initialNumberOfTroves - 1},` +
          `${total.collateral},` +
          `${collateralDifference.absoluteValue?.bigNumber},` +
          `${debtDifference.absoluteValue?.bigNumber}\n`
      );
    }
  )

  .command("check-sorting", "Check if Troves are sorted by ICR.", {}, async () => {
    const deployerLiquity = await Liquity.connect(addresses, deployer);
    const price = await deployerLiquity.getPrice();
    const listOfTroves = await getListOfTroves(deployerLiquity);

    await checkTroveOrdering(deployerLiquity, price, listOfTroves);

    console.log("All Troves are sorted.");
  })

  .command("check-subgraph", "Check that subgraph data matches layer 1.", {}, async () => {
    const deployerLiquity = await Liquity.connect(addresses, deployer);

    await checkSubgraph(subgraph, deployerLiquity);

    console.log("Subgraph looks fine.");
  })

  .demandCommand()
  .wrap(null)
  .parse();