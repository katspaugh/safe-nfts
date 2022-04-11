import { ReactElement, useState } from 'react'
import css from './styles.module.css'

const openSeaUrlRegex = /:\/\/(?:testnets.)?opensea\.io\/assets\/(0x[a-z0-9]{40})\/([0-9]+)/i
const exampleCollection = '0xbe6a2f5960b27c7fde12e073d61b962d9c6c3cb7'
const exampleId = '718'

interface UrlInputProps {
  onChange: (tokenAddress: string, tokenId: string) => unknown
}

const UrlInput = ({ onChange }: UrlInputProps): ReactElement => {
  const [defaultLink, setDefaultLink] = useState<string>('')

  const onExampleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setDefaultLink(e.currentTarget.href)
    onChange(exampleCollection, exampleId)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const [ , collection, id ] = val.match(openSeaUrlRegex) || []
    onChange(collection || '', id || '')
  }

  return (
    <div className={css.container}>
      <label>
        NFT link on OpenSea<br />
        <input onChange={onInputChange} defaultValue={defaultLink} key={defaultLink} />
      </label>

      <div>
        E.g.{' '}
        <a href={`https://opensea.io/assets/${exampleCollection}/${exampleId}`} onClick={onExampleClick}>
          {`https://opensea.io/assets/${exampleCollection}/${exampleId}`}
        </a>
      </div>
    </div>
  )
}

export default UrlInput
