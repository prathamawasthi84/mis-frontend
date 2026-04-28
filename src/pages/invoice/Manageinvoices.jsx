import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInvoices, updateInvoice, deleteInvoice } from "../../api";

export default function ManageInvoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit email modal state
  const [editModal, setEditModal] = useState({ show: false, id: null, emailId: "" });

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (keyword = "") => {
    setLoading(true);
    try {
      const res = await getAllInvoices(keyword);
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchInvoices(val);
  };

  // Edit — only email is editable
  const openEditModal = (inv) => {
    setEditModal({ show: true, id: inv.id, emailId: inv.emailId || "" });
  };

  const handleUpdateEmail = async () => {
    try {
      await updateInvoice(editModal.id, editModal.emailId);
      setEditModal({ show: false, id: null, emailId: "" });
      fetchInvoices(search);
    } catch (err) {
      console.error("Error updating invoice:", err);
      alert("Failed to update email.");
    }
  };

  // Delete
  const confirmDelete = (id) => setDeleteConfirm({ show: true, id });

  const handleDelete = async () => {
    try {
      await deleteInvoice(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null });
      fetchInvoices(search);
    } catch (err) {
      console.error("Error deleting invoice:", err);
      alert("Failed to delete invoice.");
    }
  };

  return (
    <div style={pageWrapper}>
      {/* Header */}
      <div style={header}>
        <span style={headerBrand}>Invoice</span>
        <span style={headerSection}>| Manage Invoice Section</span>
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
              onClick={() => {
                if (item === "Manage Estimate") navigate("/manage-estimate");
                if (item === "Dashboard") navigate("/dashboard");
              }}
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

        {/* Main */}
        <div style={mainContent}>
          {/* Total Invoice Card */}
          <div style={statCard}>
            <p style={{ margin: 0, fontSize: "14px" }}>Total Invoice</p>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
              {invoices.length}
            </p>
          </div>

          {/* Search */}
          <div style={searchWrapper}>
            <label style={searchLabel}>Search Invoice</label>
            <input
              value={search}
              onChange={handleSearch}
              placeholder="type invoice number, chain id or company name"
              style={searchInput}
            />
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            {loading ? (
              <p style={{ color: "#aaa", padding: "24px" }}>Loading...</p>
            ) : (
              <table style={tableStyle}>
                <thead style={{ backgroundColor: "#f0f0f0" }}>
                  <tr>
                    {[
                      "Sr.No",
                      "Invoice No",
                      "Estimate ID",
                      "Chain ID",
                      "Company Name",
                      "Service Details",
                      "Total Qty",
                      "Price Per Qty",
                      "Total",
                      "Edit",
                      "Delete",
                    ].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        style={{ textAlign: "center", padding: "24px", color: "#aaa" }}
                      >
                        No invoices found.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv, idx) => (
                      <tr
                        key={inv.id}
                        style={{ borderBottom: "1px solid #f0f0f0" }}
                      >
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>{inv.invoiceNo}</td>
                        <td style={tdStyle}>{inv.estimatedId}</td>
                        <td style={tdStyle}>{inv.chainId}</td>
                        <td style={tdStyle}>{inv.chainName}</td>
                        <td style={tdStyle}>{inv.serviceDetails}</td>
                        <td style={tdStyle}>{inv.qty}</td>
                        <td style={tdStyle}>{inv.costPerQty}</td>
                        <td style={tdStyle}>{inv.amountPayable}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => openEditModal(inv)}
                            style={editBtn}
                          >
                            Edit
                          </button>
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => confirmDelete(inv.id)}
                            style={deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit Email Modal */}
      {editModal.show && (
        <div style={overlay}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: "8px", color: "#333" }}>Update Invoice</h3>
            <p style={{ fontSize: "13px", color: "#777", marginBottom: "20px" }}>
              Only the Email ID can be updated. To change other fields, update the
              estimate and regenerate the invoice.
            </p>
            <label style={labelStyle}>Email ID:</label>
            <input
              type="email"
              value={editModal.emailId}
              onChange={(e) =>
                setEditModal((prev) => ({ ...prev, emailId: e.target.value }))
              }
              placeholder="xyz@gmail.com"
              style={activeInput}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setEditModal({ show: false, id: null, emailId: "" })}
                style={cancelBtn}
              >
                Cancel
              </button>
              <button onClick={handleUpdateEmail} style={submitBtn}>
                Update Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirm.show && (
        <div style={overlay}>
          <div style={{ ...modalStyle, maxWidth: "400px", textAlign: "center" }}>
            <h3 style={{ color: "#e74c3c", marginBottom: "12px" }}>
              Confirm Deletion
            </h3>
            <p style={{ color: "#555", marginBottom: "24px" }}>
              Are you sure you want to delete this invoice? This action cannot be
              undone.
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "12px" }}
            >
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                style={cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ ...submitBtn, backgroundColor: "#e74c3c" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
const headerBrand = { fontWeight: "bold", fontSize: "18px", color: "#333" };
const headerSection = { fontSize: "14px", color: "#777" };
const contentWrapper = { display: "flex", minHeight: "calc(100vh - 53px)" };
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
const mainContent = { flex: 1, padding: "28px" };
const statCard = {
  backgroundColor: "#e74c3c",
  color: "#fff",
  padding: "16px 24px",
  borderRadius: "8px",
  display: "inline-block",
  marginBottom: "20px",
  minWidth: "160px",
};
const searchWrapper = { marginBottom: "20px" };
const searchLabel = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "8px",
};
const searchInput = {
  width: "100%",
  maxWidth: "500px",
  padding: "10px 14px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};
const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  fontSize: "13px",
  color: "#555",
  fontWeight: "600",
  borderBottom: "1px solid #e0e0e0",
};
const tdStyle = { padding: "12px 10px", fontSize: "13px", color: "#444" };
const editBtn = {
  backgroundColor: "#f39c12",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
const deleteBtn = {
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "32px",
  width: "90%",
  maxWidth: "480px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
};
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "6px",
};
const activeInput = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #3498db",
  borderRadius: "6px",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};
const submitBtn = {
  backgroundColor: "#2ecc71",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
const cancelBtn = {
  backgroundColor: "#bdc3c7",
  color: "#333",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};