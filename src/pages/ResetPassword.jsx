import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post(`https://web-production-1845c.up.railway.app/user/reset-password?token=${token}&newPassword=${password}`);
      setMessage("Password updated successfully!");

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setMessage("Invalid or expired token.");
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
            <h2 className="text-center mb-3">Reset Password</h2>

            <input
              type="password"
              className="form-control bg-secondary text-white border-0 mb-3"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-success w-100" onClick={handleReset}>
              Reset Password
            </button>

            {message && <p className="mt-3 text-center">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;