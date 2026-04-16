import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login'; 
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from './pages/Dashboard';

function App(){
return (<BrowserRouter>
<Routes>
  <Route path="/login" element={<Login />}/>
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
  </Routes>
  </BrowserRouter>
);
}
export default App;