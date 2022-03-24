<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-base](./lib-base.md) &gt; [PopulatableLiquity](./lib-base.populatableliquity.md) &gt; [claimCollateralSurplus](./lib-base.populatableliquity.claimcollateralsurplus.md)

## PopulatableLiquity.claimCollateralSurplus() method

Claim leftover collateral after a liquidation or redemption.

<b>Signature:</b>

```typescript
claimCollateralSurplus(): Promise<PopulatedLiquityTransaction<P, SentLiquityTransaction<S, LiquityReceipt<R, void>>>>;
```
<b>Returns:</b>

Promise&lt;[PopulatedLiquityTransaction](./lib-base.populatedliquitytransaction.md)<!-- -->&lt;P, [SentLiquityTransaction](./lib-base.sentliquitytransaction.md)<!-- -->&lt;S, [LiquityReceipt](./lib-base.liquityreceipt.md)<!-- -->&lt;R, void&gt;&gt;&gt;&gt;

## Remarks

Use [getCollateralSurplusBalance()](./lib-base.readableliquity.getcollateralsurplusbalance.md) to check the amount of collateral available for withdrawal.
