<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-base](./lib-base.md) &gt; [TransactableLiquity](./lib-base.transactableliquity.md) &gt; [borrowLUSD](./lib-base.transactableliquity.borrowlusd.md)

## TransactableLiquity.borrowLUSD() method

Adjust existing Trove by borrowing more LUSD.

<b>Signature:</b>

```typescript
borrowLUSD(amount: Decimalish, maxBorrowingRate?: Decimalish): Promise<TroveAdjustmentDetails>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | The amount of LUSD to borrow. |
|  maxBorrowingRate | [Decimalish](./lib-base.decimalish.md) | Maximum acceptable [borrowing rate](./lib-base.fees.borrowingrate.md)<!-- -->. |

<b>Returns:</b>

Promise&lt;[TroveAdjustmentDetails](./lib-base.troveadjustmentdetails.md)<!-- -->&gt;

## Exceptions

Throws [TransactionFailedError](./lib-base.transactionfailederror.md) in case of transaction failure.

## Remarks

Equivalent to:

```typescript
adjustTrove({ borrowLUSD: amount }, maxBorrowingRate)

```

