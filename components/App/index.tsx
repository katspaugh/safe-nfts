import { ReactElement, useCallback, useState } from 'react'
import { OpenSeaAsset, Order } from 'opensea-js/lib/types'
import { buyOrder, getItem, getOrder } from '../../utils/opensea'
import useSeaport from '../../utils/useSeaport'
import useAsync from '../../utils/useAsync'
import Preview from '../Preview'
import UrlInput from '../UrlInput'
import OwnedAssets from '../OwnedAssets'
import Message from '../Message'
import css from './styles.module.css'

const App = (): ReactElement => {
  const isReady = useSeaport() // init OpenSea SDK

  const [tokenAddress, setTokenAddress] = useState<string>()
  const [tokenId, setTokenId] = useState<string>()
  const [buyError, setBuyError] = useState<Error>()

  // Get NFT and price info from OpenSea
  const getAsset = useCallback(() => {
    if (!(tokenAddress && tokenId)) return Promise.resolve()

    return Promise.all([
      getItem(tokenAddress, tokenId),
      getOrder(tokenAddress, tokenId).catch(() => undefined),
    ])
  }, [tokenAddress, tokenId])

  const { result: assetResult, error: assetError, loading } = useAsync<[ OpenSeaAsset, Order | undefined ] | void>(getAsset)
  const [ tokenInfo, orderInfo ] = assetResult || []
  const anyError = buyError || assetError

  // Buy the NFT
  const onBuy = useCallback(() => {
    if (!orderInfo) return

    setBuyError(undefined)

    buyOrder(orderInfo)
      .then((hash) => {
        console.log('Transaction hash', hash)
      })
      .catch((err) => {
        setBuyError(err)
      })
  }, [setBuyError, orderInfo])

  // A new OpenSea URL is pasted
  const onAddressChange = (address: string, id: string) => {
    setTokenAddress(address)
    setTokenId(id)
    setBuyError(undefined)
  }

  return (
    <div className={css.container}>
      <h1>Safe NFTs</h1>
      <h2>Buy NFTs from the comfort of your Safe</h2>

      <UrlInput onChange={onAddressChange} />

      {tokenInfo && (
        <Preview asset={tokenInfo} order={orderInfo} onBuy={onBuy} />
      )}

      {anyError && <Message message={anyError} />}

      {loading && <Message message="Loading NFT..." />}

      {isReady && <OwnedAssets />}
    </div>
  )
}

export default App
