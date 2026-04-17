import axios from "axios";
import './Login.css';
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        email: email,
        password: password
      });
      localStorage.setItem('token', response.data);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/img/image.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position:'relative'
    }}>
      <img
      src="/img/logo.png"
      alt="Logo"
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        width: '200px',
        height: '200px',
        objectFit: 'contain'
      }}
    />
      <div className="row justify-content-center w-100">
        <div className="col-md-4">
          <div className="card bg-dark text-white border-secondary shadow-lg">
            <div className="card-body" style={{ padding: '2rem' }}>
              <h1 className="text-center">Login</h1>
              <div className="mb-3">
                <label className="text-secondary">Email</label>
                <input type="email"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-secondary">Password</label>
                <input type="password"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mt-3">
                <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
              </div>
              <p
                     style={{ cursor: "pointer", color: "#4361ee" }}
                      onClick={() => navigate('/forgot-password')}
                    >
                 Forgot Password?
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;