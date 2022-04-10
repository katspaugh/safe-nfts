import Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { assetFromJSON } from 'opensea-js/lib/utils/utils'
import { OpenSeaAsset, Order, OrderSide } from 'opensea-js/lib/types'
import { provider as Provider } from 'web3-core'

const rinkebyChainId = 4
let seaport: OpenSeaPort = null
let provider = null

export const initSeaport = (web3Provider: Provider) => {
  if (seaport) return seaport

  provider = web3Provider

  const isTestNet = provider.safe.chainId == rinkebyChainId

  seaport = new OpenSeaPort(provider, {
    networkName: isTestNet ? Network.Rinkeby : Network.Main,
    apiKey: isTestNet ? undefined : process.env.OPENSEA_KEY
  })

  console.log('OpenSeaPort initialized', seaport)

  return seaport
}

export const getItem = async (tokenAddress: string, tokenId: string | number | null): Promise<OpenSeaAsset> => {
  const asset: OpenSeaAsset = await seaport.api.getAsset({
    tokenAddress,
    tokenId,
  })
  return asset
}

export const getOrder = async (tokenAddress: string, tokenId: string | number): Promise<Order> => {
  const order = await seaport.api.getOrder({
    side: OrderSide.Sell,
    asset_contract_address: tokenAddress,
    token_id: tokenId,
  })
  console.log({ order })
  return order
}

export const buyOrder = async (order: Order, accountAddress = provider.safe.safeAddress): Promise<string> => {
  const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
  return transactionHash
}

type AssetsPage = {
  assets: unknown[],
  next: string | null,
  prev: string | null,
}

export const getOwnedAssets = async (accountAddress = provider.safe.safeAddress): Promise<OpenSeaAsset[]> => {
  const endpoint = `/api/v1/assets?owner=${accountAddress}`

  return fetch(seaport.api.apiBaseUrl + endpoint)
    .then(resp => resp.json())
    .then((data: AssetsPage) => data.assets.map(assetFromJSON))
}

export const formatPrice = (price: string, paymentToken: Order['paymentTokenContract']): string => {
  return (Number(price) / Math.pow(10, paymentToken.decimals)) + ' ' + paymentToken.symbol;
}
