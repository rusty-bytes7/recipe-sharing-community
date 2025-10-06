import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'
import rustyImage from './IMG_3448.PNG'

export function Header() {
  const [token, setToken] = useAuth()

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ccc',
      }}
    >
      <img width='100' src={rustyImage} alt="Rusty's Recipe Sharing" />
      <h1 style={{ margin: 0 }}>Rusty&apos;s Recipe Sharing</h1>
      <br />

      <div>
        {token ? (
          <div>
            Welcome, <User id={jwtDecode(token).sub} />!
            <br />
            <button onClick={() => setToken(null)} style={{ marginTop: '5px' }}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  )
}
