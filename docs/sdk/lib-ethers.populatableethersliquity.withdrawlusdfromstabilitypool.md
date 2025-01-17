<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-ethers](./lib-ethers.md) &gt; [PopulatableEthersLiquity](./lib-ethers.populatableethersliquity.md) &gt; [withdrawLUSDFromStabilityPool](./lib-ethers.populatableethersliquity.withdrawlusdfromstabilitypool.md)

## PopulatableEthersLiquity.withdrawLUSDFromStabilityPool() method

Withdraw LUSD from Stability Deposit.

<b>Signature:</b>

```typescript
withdrawLUSDFromStabilityPool(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<PopulatedEthersLiquityTransaction<StabilityDepositChangeDetails>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of LUSD to withdraw. |
|  overrides | [EthersTransactionOverrides](./lib-ethers.etherstransactionoverrides.md) |  |

<b>Returns:</b>

Promise&lt;[PopulatedEthersLiquityTransaction](./lib-ethers.populatedethersliquitytransaction.md)<!-- -->&lt;[StabilityDepositChangeDetails](./lib-base.stabilitydepositchangedetails.md)<!-- -->&gt;&gt;

## Remarks

As a side-effect, the transaction will also pay out the Stability Deposit's [collateral gain](./lib-base.stabilitydeposit.collateralgain.md) and [LQTY reward](./lib-base.stabilitydeposit.lqtyreward.md)<!-- -->.

