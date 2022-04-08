import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import App from '../App'

const SafeAppAdapter = () =>{
  return (
    <SafeProvider loader={<h1>Waiting for Safe...</h1>}>
      <App />
    </SafeProvider>
  )
}

export default SafeAppAdapter
