import { ReactElement } from 'react'
import Web3 from 'web3'
import { OpenSeaAsset, Order } from 'opensea-js/lib/types'
import css from './styles.module.css'

interface PreviewProps {
  asset: OpenSeaAsset
  order?: Order
  onBuy: () => unknown
}

// Format a price from a BigNumber in wei to ETH
const formatPrice = (price: Order['currentPrice']): string => {
  return Web3.utils.fromWei(price.toString(), 'ether') + ' ETH'
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

        <div className={css.description}>
          <span>Owned by</span> {asset.owner.user.username}
        </div>

        <div className={css.price}>
          {order ? formatPrice(order.currentPrice) : 'Not for sale'}
        </div>

        {order && order.currentPrice && (
          <button onClick={onBuyClick}>Buy</button>
        )}
      </div>
    </div>
  )
}

export default Preview
