import { OpenSeaPort, Network } from 'opensea-js'
import { OpenSeaAsset, Order, OrderSide } from 'opensea-js/lib/types'
import { provider as Provider } from 'web3-core'

let seaport = null
let provider = null

export const initSeaport = (web3Provider: Provider, isTestNet = false) => {
  if (seaport) return seaport

  provider = web3Provider

  seaport = new OpenSeaPort(provider, {
    networkName: isTestNet ? Network.Rinkeby : Network.Main,
    apiKey: isTestNet ? undefined : process.env.OPENSEA_KEY || '54f28eb29db648719c2eaaabccc414fc'
  })

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
  return order
}

export const buyOrder = async (order: Order, accountAddress = provider.safe.safeAddress): Promise<string> => {
  const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
  return transactionHash
}
