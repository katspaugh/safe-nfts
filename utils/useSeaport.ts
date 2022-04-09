import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider/dist/provider'
import { initSeaport } from './opensea'
import { useEffect } from 'react'

const rinkebyChainId = 4

const useSeaport = (): void => {
  const { sdk, safe } = useSafeAppsSDK()

  useEffect(() => {
    const prov: any = new SafeAppProvider(safe, sdk as any)
    const web3: Web3 = new Web3(prov)
    const isTestNet = safe.chainId == rinkebyChainId
    initSeaport(web3.currentProvider as Provider, isTestNet)
  }, [sdk, safe])
}

export default useSeaport
