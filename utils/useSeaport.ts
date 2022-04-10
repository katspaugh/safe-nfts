import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider/dist/provider'
import { initSeaport } from './opensea'
import { useEffect, useState } from 'react'

const useSeaport = (): boolean => {
  const { sdk, safe } = useSafeAppsSDK()
  const [isReady, setReady] = useState<boolean>(false)

  useEffect(() => {
    const prov: any = new SafeAppProvider(safe, sdk as any)
    const web3: Web3 = new Web3(prov)
    initSeaport(web3.currentProvider as Provider)
    setReady(true)
  }, [sdk, safe, setReady])

  return isReady
}

export default useSeaport
