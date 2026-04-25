// updated
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import ManageGroups from "./groupmanagement/ManageGroups";
import ManageChains from "./chain/ManageChains";

function Dashboard() {
  return (
    <div style={{ display: "flex", backgroundColor: "#0f0f1a", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", flex: 1 }}>
        <Navbar />
        <div style={{ marginTop: "60px", padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<div style={{ color: "#fff" }}>Welcome to Dashboard</div>} />
            <Route path="manage-groups" element={<ManageGroups />} />
            <Route path="manage-chain" element={<ManageChains />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
