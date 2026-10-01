import './Loader.css'

function Loader({ size = 'default', text = '' }) {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader
