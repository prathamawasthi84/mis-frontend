import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createInvoice } from "../../api";

export default function CreateInvoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const est = state?.estimate;

  const [emailId, setEmailId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(false);

  const balance = est
    ? (parseFloat(est.totalCost || 0) - parseFloat(amountPaid || 0)).toFixed(2)
    : 0;

  const handleSubmit = async () => {
    if (!emailId) return alert("Please enter an email ID");
    if (!amountPaid) return alert("Please enter amount paid");
    setLoading(true);
    try {
      await createInvoice({
        estimatedId: est.estimatedId,
        chainId: est.chainId,
        serviceDetails: est.service,
        qty: est.qty,
        costPerQty: est.costPerUnit,
        amountPayable: est.totalCost,
        balance: parseFloat(balance),
        dateOfPayment: new Date().toISOString(),
        dateOfService: est.deliveryDate,
        deliveryDetails: est.deliveryDetails,
        emailId: emailId,
      });
      alert("Invoice generated successfully!");
      navigate("/manage-invoices");
    } catch (err) {
      console.error("Error creating invoice:", err);
      alert("Failed to generate invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!est) {
    return (
      <div style={errorContainer}>
        <p style={{ color: "#e74c3c", fontWeight: "bold" }}>
          No estimate data found. Please go back and click Generate on an estimate.
        </p>
        <button onClick={() => navigate("/manage-estimate")} style={backBtn}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={pageWrapper}>
      {/* Header */}
      <div style={header}>
        <span style={headerBrand}>Invoice</span>
        <span style={headerSection}>| Create Invoice Section</span>
        <button onClick={() => navigate("/manage-estimate")} style={backBtn}>
          ← Back
        </button>
      </div>

      <div style={contentWrapper}>
        {/* Sidebar */}
        <div style={sidebar}>
          {[
            "Dashboard",
            "Manage Groups",
            "Manage Chain",
            "Manage Brands",
            "Manage SubZones",
            "Manage Estimate",
            "Manage Invoices",
          ].map((item) => (
            <p
              key={item}
              style={{
                ...sidebarItem,
                color: item === "Manage Invoices" ? "#e74c3c" : "#555",
                fontWeight: item === "Manage Invoices" ? "bold" : "normal",
              }}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Form */}
        <div style={formContainer}>
          <div style={formGrid}>

            {/* Row 1 */}
            <div style={formGroup}>
              <label style={labelStyle}>Invoice No:</label>
              <input value="Auto Generated" disabled style={disabledInput} />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Estimate ID:</label>
              <input value={est.estimatedId} disabled style={disabledInput} />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Chain ID:</label>
              <input value={est.chainId} disabled style={disabledInput} />
            </div>

            {/* Row 2 */}
            <div style={formGroup}>
              <label style={labelStyle}>Service Provided:</label>
              <input value={est.service} disabled style={disabledInput} />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Quantity:</label>
              <input value={est.qty} disabled style={disabledInput} />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Cost per Quantity:</label>
              <input value={est.costPerUnit} disabled style={disabledInput} />
            </div>

            {/* Row 3 */}
            <div style={formGroup}>
              <label style={labelStyle}>Amount Payable in Rs:</label>
              <input value={est.totalCost} disabled style={disabledInput} />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Amount Paid in Rs:</label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount paid"
                style={activeInput}
              />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Balance in Rs:</label>
              <input value={balance} disabled style={disabledInput} />
            </div>

            {/* Row 4 */}
            <div style={formGroup}>
              <label style={labelStyle}>Delivery Date:</label>
              <input value={est.deliveryDate || ""} disabled style={disabledInput} />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Other Delivery Details:</label>
              <textarea
                value={est.deliveryDetails || ""}
                disabled
                style={{ ...disabledInput, height: "80px", resize: "none" }}
              />
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Enter Email ID:</label>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="xyz@gmail.com"
                style={activeInput}
              />
            </div>

          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={loading ? { ...generateBtn, opacity: 0.7 } : generateBtn}
          >
            {loading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const pageWrapper = {
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  fontFamily: "sans-serif",
};
const header = {
  backgroundColor: "#fff",
  padding: "14px 24px",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
const headerBrand = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#333",
};
const headerSection = {
  fontSize: "14px",
  color: "#777",
  flex: 1,
};
const contentWrapper = {
  display: "flex",
  minHeight: "calc(100vh - 53px)",
};
const sidebar = {
  width: "180px",
  backgroundColor: "#fff",
  borderRight: "1px solid #e0e0e0",
  padding: "20px 16px",
};
const sidebarItem = {
  fontSize: "14px",
  marginBottom: "14px",
  cursor: "pointer",
};
const formContainer = {
  flex: 1,
  padding: "28px",
};
const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "16px",
  marginBottom: "24px",
};
const formGroup = {
  display: "flex",
  flexDirection: "column",
};
const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "6px",
};
const disabledInput = {
  padding: "9px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  fontSize: "13px",
  backgroundColor: "#f9f9f9",
  color: "#666",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const activeInput = {
  padding: "9px 12px",
  border: "1px solid #3498db",
  borderRadius: "6px",
  fontSize: "13px",
  backgroundColor: "#fff",
  color: "#333",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const generateBtn = {
  backgroundColor: "#3498db",
  color: "#fff",
  border: "none",
  padding: "11px 28px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
const backBtn = {
  backgroundColor: "#bdc3c7",
  color: "#333",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};
const errorContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  gap: "16px",
  fontFamily: "sans-serif",
};