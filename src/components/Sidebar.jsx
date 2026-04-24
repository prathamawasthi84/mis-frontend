import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Manage Groups", path: "/dashboard/manage-groups" },
    { label: "Manage Chain", path: "/dashboard/manage-chain" },
    { label: "Manage Brands", path: "/dashboard/manage-brands" },
    { label: "Manage SubZones", path: "/dashboard/manage-subzones" },
    { label: "Manage Estimate", path: "/dashboard/manage-estimate" },
    { label: "Manage Invoices", path: "/dashboard/manage-invoices" },
  ];

  return (
    <div style={{
      width: "220px",
      minHeight: "100vh",
      backgroundColor: "#1a1a2e",
      borderRight: "1px solid #2a2a3e",
      padding: "1rem 0",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a3e", marginBottom: "1rem" }}>
        <h5 style={{ color: "#fff", margin: 0, fontWeight: "bold" }}>Invoice</h5>
      </div>

      {menuItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            color: location.pathname === item.path ? "#4361ee" : "#adb5bd",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
            backgroundColor: location.pathname === item.path ? "#16213e" : "transparent",
            borderLeft: location.pathname === item.path ? "3px solid #4361ee" : "3px solid transparent",
            transition: "all 0.2s"
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;