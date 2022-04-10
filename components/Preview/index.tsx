import { ReactElement } from 'react'
import { OpenSeaAsset, Order } from 'opensea-js/lib/types'
import { formatPrice } from '../../utils/opensea'
import css from './styles.module.css'

interface PreviewProps {
  asset: OpenSeaAsset
  order?: Order
  onBuy: () => unknown
}

const Preview = ({ asset, order, onBuy }: PreviewProps): ReactElement => {
  const onBuyClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onBuy()
  }

  return (
    <div className={css.preview}>
      <div>
        <img src={asset.imagePreviewUrl} />
      </div>

      <div>
        <div>
          {asset.collection.name}<br />
          <a href={asset.openseaLink} target="_blank">{asset.name}</a>
        </div>

        {asset.owner && (
          <div className={css.description}>
            <span>Owned by</span> {asset.owner.user.username}
          </div>
        )}

        <div className={css.price}>
          {order ? formatPrice(order.currentPrice.toString(), order.paymentTokenContract) : 'Not for sale'}
        </div>

        {order && order.currentPrice && (
          <button onClick={onBuyClick}>Buy</button>
        )}
      </div>
    </div>
  )
}

export default Preview
