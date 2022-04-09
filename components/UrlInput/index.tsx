import { ReactElement, useState } from 'react'
import css from './styles.module.css'

const openSeaUrlRegex = /:\/\/(?:testnets.)?opensea\.io\/assets\/(0x[a-z0-9]{40})\/([0-9]+)/i
const exampleCollection = '0x71e24f80f2f7cbcd07009ad91ccc469d53bb10e0'
const exampleId = '14'

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
