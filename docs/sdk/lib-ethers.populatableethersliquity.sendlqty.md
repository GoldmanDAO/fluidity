<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-ethers](./lib-ethers.md) &gt; [PopulatableEthersLiquity](./lib-ethers.populatableethersliquity.md) &gt; [sendLQTY](./lib-ethers.populatableethersliquity.sendlqty.md)

## PopulatableEthersLiquity.sendLQTY() method

Send LQTY tokens to an address.

<b>Signature:</b>

```typescript
sendLQTY(toAddress: string, amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<PopulatedEthersLiquityTransaction<void>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  toAddress | string | Address of receipient. |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of LQTY to send. |
|  overrides | [EthersTransactionOverrides](./lib-ethers.etherstransactionoverrides.md) |  |

<b>Returns:</b>

Promise&lt;[PopulatedEthersLiquityTransaction](./lib-ethers.populatedethersliquitytransaction.md)<!-- -->&lt;void&gt;&gt;

