import css from './styles.module.css'

const Message = ({ message }: { message: Error | string } ) => {
  const error = message instanceof Error ? message : null

  return (
    <div className={[ css.message, error ? css.error : '' ].join(' ')}>
      {error ? error.message : message}
    </div>
  )
}

export default Message
