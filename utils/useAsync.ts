import { useEffect, useState } from 'react'

type AsyncResult<T> = {
  error: Error | undefined
  result: T | undefined
  loading: boolean
}

const useAsync = <T>(asyncCall: () => Promise<T>): AsyncResult<T> => {
  const [asyncVal, setAsyncVal] = useState<T>()
  const [err, setErr] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let isCurrent = true

    setAsyncVal(undefined)
    setErr(undefined)
    setLoading(true)

    asyncCall()
      .then((val: T) => {
        if (isCurrent) {
          setAsyncVal(val)
          setLoading(false)
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setErr(error)
          setLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [asyncCall])

  return { error: err, result: asyncVal, loading }
}

export default useAsync
