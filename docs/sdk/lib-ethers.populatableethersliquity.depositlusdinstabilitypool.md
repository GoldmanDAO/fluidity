<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-ethers](./lib-ethers.md) &gt; [PopulatableEthersLiquity](./lib-ethers.populatableethersliquity.md) &gt; [depositLUSDInStabilityPool](./lib-ethers.populatableethersliquity.depositlusdinstabilitypool.md)

## PopulatableEthersLiquity.depositLUSDInStabilityPool() method

Make a new Stability Deposit, or top up existing one.

<b>Signature:</b>

```typescript
depositLUSDInStabilityPool(amount: Decimalish, frontendTag?: string, overrides?: EthersTransactionOverrides): Promise<PopulatedEthersLiquityTransaction<StabilityDepositChangeDetails>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of LUSD to add to new or existing deposit. |
|  frontendTag | string | Address that should receive a share of this deposit's LQTY rewards. |
|  overrides | [EthersTransactionOverrides](./lib-ethers.etherstransactionoverrides.md) |  |

<b>Returns:</b>

Promise&lt;[PopulatedEthersLiquityTransaction](./lib-ethers.populatedethersliquitytransaction.md)<!-- -->&lt;[StabilityDepositChangeDetails](./lib-base.stabilitydepositchangedetails.md)<!-- -->&gt;&gt;

## Remarks

The `frontendTag` parameter is only effective when making a new deposit.

As a side-effect, the transaction will also pay out an existing Stability Deposit's [collateral gain](./lib-base.stabilitydeposit.collateralgain.md) and [LQTY reward](./lib-base.stabilitydeposit.lqtyreward.md)<!-- -->.
