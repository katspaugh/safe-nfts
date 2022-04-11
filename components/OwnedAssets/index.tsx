import { OpenSeaAsset } from 'opensea-js/lib/types'
import { ReactElement } from 'react'
import { formatPrice, getOwnedAssets } from '../../utils/opensea'
import useAsync from '../../utils/useAsync'
import Message from '../Message'
import css from './styles.module.css'

const Asset = ({ asset }: { asset: OpenSeaAsset }) => {
  return (
    <div className={css.asset}>
      <a href={asset.openseaLink} target="_blank">
        <img src={asset.imageUrlThumbnail} alt="thumbnail" />
      </a>

      <div>
        {asset.collection.name}

        <a href={asset.openseaLink} target="_blank">{asset.name}</a>

        {asset.lastSale && (
          <span>
            Last sold for <b>{formatPrice(asset.lastSale.totalPrice, asset.lastSale.paymentToken)}</b>
          </span>
        )}
      </div>
    </div>
  )
}

const OwnedAssets = (): ReactElement => {
  const { result, error, loading } = useAsync<OpenSeaAsset[]>(getOwnedAssets)

  return (
    <div className={css.container}>
      <h2>Owned NFTs</h2>

      {loading && 'Loading owned assets...'}

      {error && <Message message={error} />}

      <div className={css.grid}>
        {result?.map(item => <Asset asset={item} key={`${item.tokenAddress}_${item.tokenId}`} />)}
      </div>

      {!loading && !result?.length && (
        <div>No NFTs found</div>
      )}
    </div>
  )
}

export default OwnedAssets
