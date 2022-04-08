import { OpenSeaPort, Network } from 'opensea-js'
import { OpenSeaAsset, Order, OrderSide } from 'opensea-js/lib/types'
import { provider as Provider } from 'web3-core'

// This example provider won't let you make transactions, only read-only calls:
let seaport = null

export const initSeaport = (provider: Provider) => {
  if (seaport) return seaport

  seaport = new OpenSeaPort(provider, {
    networkName: Network.Main,
    apiKey: process.env.OPENSEA_KEY || '54f28eb29db648719c2eaaabccc414fc'
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

export const buyOrder = async (order: Order, accountAddress: string): Promise<string> => {
  const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
  return transactionHash
}
