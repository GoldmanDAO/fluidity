<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-ethers](./lib-ethers.md) &gt; [PopulatedEthersLiquityTransaction](./lib-ethers.populatedethersliquitytransaction.md) &gt; [gasHeadroom](./lib-ethers.populatedethersliquitytransaction.gasheadroom.md)

## PopulatedEthersLiquityTransaction.gasHeadroom property

Extra gas added to the transaction's `gasLimit` on top of the estimated minimum requirement.

<b>Signature:</b>

```typescript
readonly gasHeadroom?: number;
```

## Remarks

Gas estimation is based on blockchain state at the latest block. However, most transactions stay in pending state for several blocks before being included in a block. This may increase the actual gas requirements of certain Liquity transactions by the time they are eventually mined, therefore the Liquity SDK increases these transactions' `gasLimit` by default (unless `gasLimit` is [overridden](./lib-ethers.etherstransactionoverrides.md)<!-- -->).

Note: even though the SDK includes gas headroom for many transaction types, currently this property is only implemented for [openTrove()](./lib-ethers.populatableethersliquity.opentrove.md)<!-- -->, [adjustTrove()](./lib-ethers.populatableethersliquity.adjusttrove.md) and its aliases.

