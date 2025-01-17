<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@fluidity/lib-ethers](./lib-ethers.md) &gt; [ReadableEthersLiquity](./lib-ethers.readableethersliquity.md) &gt; [getUniTokenBalance](./lib-ethers.readableethersliquity.getunitokenbalance.md)

## ReadableEthersLiquity.getUniTokenBalance() method

Get the amount of Uniswap ETH/LUSD LP tokens held by an address.

<b>Signature:</b>

```typescript
getUniTokenBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  address | string | Address whose balance should be retrieved. |
|  overrides | [EthersCallOverrides](./lib-ethers.etherscalloverrides.md) |  |

<b>Returns:</b>

Promise&lt;[Decimal](./lib-base.decimal.md)<!-- -->&gt;

