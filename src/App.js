import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login'; 
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageChains from './pages/chain/ManageChains';
import ManageBrands from './pages/brands/ManageBrands';

function App(){
return (<BrowserRouter>
<Routes>
  <Route path="/" element={<Navigate to="/login" replace />}/>
  <Route path="/login" element={<Login />}/>
  <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="manage-chains" element={<ManageChains />} />
  <Route path="manage-brands" element={<ManageBrands />} />
  </Routes>
  </BrowserRouter>
);
}
export default App;