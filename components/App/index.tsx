import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

import { OpenSeaAsset, Order } from 'opensea-js/lib/types'
import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import { buyOrder, getItem, getOrder, initSeaport } from '../../utils/opensea'
import useAsync from '../../utils/useAsync'
import css from './styles.module.css'

const Buy = ({ order, recepient }: { order: Order, recepient: string }) => {
  const buyAsset = useCallback(() => {
    return buyOrder(order, recepient)
  }, [order, recepient])

  const { result, error, loading } = useAsync<string>(buyAsset)

  console.log(result)

  return (
    <div>
      {loading ? 'Buying...' : error ? error.message : result}
    </div>
  )
}

const App = () => {
  const { sdk, safe } = useSafeAppsSDK()

  const [tokenAddress, setTokenAddress] = useState<string>()
  const [tokenId, setTokenId] = useState<string>()
  const [buyError, setBuyError] = useState<Error>()

  const getAsset = useCallback(() => {
    if (!(tokenAddress && tokenId)) return Promise.resolve()

    return Promise.all([
      getItem(tokenAddress, tokenId),
      getOrder(tokenAddress, tokenId).catch(() => undefined),
    ])
  }, [tokenAddress, tokenId])

  const { result, error, loading } = useAsync<[ OpenSeaAsset, Order | void ] | void>(getAsset)
  const [ tokenInfo, orderInfo ] = result || []
  const anyError = buyError || error

  const onBuy = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!orderInfo) return

    setBuyError(undefined)

    buyOrder(orderInfo, safe.safeAddress).then(hash => {
      console.log(hash)
    }).catch((err) => {
      setBuyError(err)
    })
  }

  const onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const [ , collection, id ] = val.match(/:\/\/opensea\.io\/assets\/(0x[a-z0-9]{40})\/([0-9]+)/i)

    if (collection && id) {
      setTokenAddress(collection)
      setTokenId(id)
    }

    setBuyError(undefined)
  }

  useEffect(() => {
    const prov: any = new SafeAppProvider(safe, sdk)
    const web3: any = new Web3(prov)
    initSeaport(web3.currentProvider)
  }, [sdk, safe])

  return (
    <div className={css.container}>
      <h1>Safe NFTs</h1>

      <div>
        <label>
          NFT link on OpenSea<br />
          <input onChange={onLinkChange} />
        </label>
      </div>

      {loading && 'Loading NFT...'}

      {anyError && (
        <div className={css.error}>
          Error loading NFT: {anyError.message}
        </div>
      )}

      {tokenInfo && (
        <div className={css.preview}>
          <div>
            <img src={tokenInfo.imageUrlThumbnail} />
          </div>

          <div>
            {tokenInfo.collection.name}<br />
            {tokenInfo.name}<br />
            <div className={css.price}>
              {orderInfo ? Web3.utils.fromWei(orderInfo.currentPrice.toString(), 'ether') + ' ETH' : 'Not for sale'}
            </div>
            <a href={tokenInfo.openseaLink}>View on OpenSea</a>
          </div>

          <div>
            {orderInfo && orderInfo.currentPrice && (
              <button onClick={onBuy}>Buy</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
