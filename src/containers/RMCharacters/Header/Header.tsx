import './Header.scss'
import logo from '../../../assets/logo.png'

export function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </div>
  )
}
