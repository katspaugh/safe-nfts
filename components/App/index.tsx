import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { provider as Provider } from 'web3-core'

import { OpenSeaAsset, Order } from 'opensea-js/lib/types'
import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import { buyOrder, getItem, getOrder, initSeaport } from '../../utils/opensea'
import useAsync from '../../utils/useAsync'
import css from './styles.module.css'

const rinkebyChainId = 4
const exampleCollection = '0x71e24f80f2f7cbcd07009ad91ccc469d53bb10e0'
const exampleId = '4'

const App = () => {
  const { sdk, safe } = useSafeAppsSDK()

  const [tokenAddress, setTokenAddress] = useState<string>()
  const [tokenId, setTokenId] = useState<string>()
  const [buyError, setBuyError] = useState<Error>()
  const [defaultLink, setDefaultLink] = useState<string>('')

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

    buyOrder(orderInfo, safe.safeAddress)
      .then((hash) => {
        console.log('Transaction hash', hash)
      })
      .catch((err) => {
        setBuyError(err)
      })
  }

  const onAddressChange = (address: string, id: string) => {
    setTokenAddress(address)
    setTokenId(id)
    setBuyError(undefined)
  }

  const onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const [ , collection, id ] = val.match(/:\/\/(?:testnets.)?opensea\.io\/assets\/(0x[a-z0-9]{40})\/([0-9]+)/i) || []
    onAddressChange(collection || '', id || '')
  }

  const onExampleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setDefaultLink(e.currentTarget.href)
    onAddressChange(exampleCollection, exampleId)
  }

  useEffect(() => {
    const prov: any = new SafeAppProvider(safe, sdk as any)
    const web3: Web3 = new Web3(prov)
    const isTestNet = safe.chainId == rinkebyChainId
    initSeaport(web3.currentProvider as Provider, isTestNet)
  }, [sdk, safe])

  return (
    <div className={css.container}>
      <h1>Safe NFTs</h1>
      <h2>Buy NFTs from the comfort of your Safe</h2>

      <div>
        <label>
          NFT link on OpenSea<br />
          <input onChange={onLinkChange} defaultValue={defaultLink} key={defaultLink} />
        </label>

        <div>
          E.g.{' '}
          <a href={`https://opensea.io/assets/${exampleCollection}/${exampleId}`} onClick={onExampleClick}>
            {`https://opensea.io/assets/${exampleCollection}/${exampleId}`}
          </a>
        </div>
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
