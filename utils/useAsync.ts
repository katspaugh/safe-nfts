import { useEffect, useState } from 'react'

type AsyncResult<T> = {
  error: Error | undefined
  result: T | undefined
  loading: boolean
}

const useAsync = <T>(asyncCall: () => Promise<T>): AsyncResult<T> => {
  const [result, setResult] = useState<T>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let isCurrent = true

    setResult(undefined)
    setError(undefined)
    setLoading(true)

    asyncCall()
      .then((val: T) => {
        if (isCurrent) {
          setResult(val)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [asyncCall])

  return { error, result, loading }
}

export default useAsync
