import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
     await axios.post(`https://web-production-1845c.up.railway.app/user/forgot-password?email=${email}`);
      setMessage("Reset link sent! Check your email.");
    } catch (err) {
      setMessage("Something went wrong.");
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
      position: 'relative'
    }}>
      
      <img
        src="/img/logo.png"
        alt="Logo"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '180px',
          height: '180px'
        }}
      />

      <div className="col-md-4">
        <div className="card bg-dark text-white border-secondary shadow-lg">
          <div className="card-body p-4">
            <h2 className="text-center mb-3">Forgot Password</h2>

            <input
              type="email"
              className="form-control bg-secondary text-white border-0 mb-3"
              placeholder="Enter your email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Send Reset Link
            </button>

            {message && <p className="mt-3 text-center">{message}</p>}

            <p className="text-center mt-3 text-secondary">
              Back to{' '}
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
  );
}

export default ForgotPassword;