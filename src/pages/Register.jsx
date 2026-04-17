import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/user/register', {
        fullName: fullname,
        email,
        password
      });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
  console.log("FULL ERROR:", error); // 👈 full object
  console.log("RESPONSE DATA:", error.response?.data); // 👈 important
  console.log("STATUS:", error.response?.status);

  setError(
    typeof error.response?.data === "string"
      ? error.response.data
      : JSON.stringify(error.response?.data)
  );
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
      position: 'relative'
    }}>
      <img
        src="/img/logo.png"
        alt="Logo"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '180px',
          height: '180px',
          objectFit: 'contain'
        }}
      />

      <div className="row justify-content-center w-100">
        <div className="col-md-4">
          <div className="card bg-dark text-white border-secondary shadow-lg">
            <div className="card-body" style={{ padding: '2rem' }}>
              <h1 className="text-center mb-4">Register</h1>
              <div className="mb-3">
                <label className="text-secondary">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Enter full name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary">Email</label>
                <input
                  type="email"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

              <div className="mt-3">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
              <p className="text-center mt-3 text-secondary">
                Already have an account?{' '}
                <span
                  style={{ color: '#4361ee', cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </span>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;