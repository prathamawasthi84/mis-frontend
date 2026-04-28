import React, { useState, useEffect } from "react";
import {
  getAllEstimations,
  addEstimation,
  updateEstimation,
  deleteEstimation,
  getAllChains,
  getAllGroups,
  getAllBrands,
  getAllZones,
} from "../../api";

const initialForm = {
  chainId: "",
  groupName: "",
  brandName: "",
  zoneName: "",
  service: "",
  qty: "",
  costPerUnit: "",
  totalCost: "",
  deliveryDate: "",
  deliveryDetails: "",
};

export default function ManageEstimate() {
  const [estimations, setEstimations] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const [filterBrand, setFilterBrand] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [estRes, chainRes, groupRes, brandRes, zoneRes] = await Promise.all([
        getAllEstimations(),
        getAllChains(),
        getAllGroups(),
        getAllBrands(),
        getAllZones(),
      ]);
      setEstimations(estRes.data);
      setChains(chainRes.data);
      setGroups(groupRes.data);
      setBrands(brandRes.data);
      setZones(zoneRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate total cost
      if (name === "qty" || name === "costPerUnit") {
        const qty = name === "qty" ? value : prev.qty;
        const cpu = name === "costPerUnit" ? value : prev.costPerUnit;
        updated.totalCost = qty && cpu ? (parseFloat(qty) * parseFloat(cpu)).toFixed(2) : "";
      }
      return updated;
    });
  };

  const openAddModal = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (est) => {
    setForm({
      chainId: est.chainId,
      groupName: est.groupName,
      brandName: est.brandName,
      zoneName: est.zoneName,
      service: est.service,
      qty: est.qty,
      costPerUnit: est.costPerUnit,
      totalCost: est.totalCost,
      deliveryDate: est.deliveryDate,
      deliveryDetails: est.deliveryDetails,
    });
    setIsEditing(true);
    setEditId(est.estimatedId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        qty: parseInt(form.qty),
        costPerUnit: parseFloat(form.costPerUnit),
        totalCost: parseFloat(form.totalCost),
        chainId: parseInt(form.chainId),
      };
      if (isEditing) {
        await updateEstimation(editId, payload);
      } else {
        await addEstimation(payload);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error("Error saving estimation:", err);
    }
  };

  const confirmDelete = (id) => setDeleteConfirm({ show: true, id });

  const handleDelete = async () => {
    try {
      await deleteEstimation(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null });
      fetchAll();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const filtered = estimations.filter((e) => {
    return (
      (filterBrand ? e.brandName === filterBrand : true) &&
      (filterGroup ? e.groupName === filterGroup : true)
    );
  });

  const uniqueBrands = [...new Set(estimations.map((e) => e.brandName))];
  const uniqueGroups = [...new Set(estimations.map((e) => e.groupName))];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#f5f6fa" }}>

      {/* Sidebar */}
      <div style={{ width: "200px", backgroundColor: "#fff", borderRight: "1px solid #e0e0e0", padding: "20px 16px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontWeight: "bold", color: "#333", marginBottom: "8px" }}>Filter by Brand</p>
          {uniqueBrands.map((b) => (
            <p
              key={b}
              onClick={() => setFilterBrand(filterBrand === b ? "" : b)}
              style={{
                cursor: "pointer",
                color: filterBrand === b ? "#e74c3c" : "#e74c3c",
                fontWeight: filterBrand === b ? "bold" : "normal",
                marginBottom: "6px",
                fontSize: "14px",
              }}
            >
              {b}
            </p>
          ))}
        </div>
        <div>
          <p style={{ fontWeight: "bold", color: "#333", marginBottom: "8px" }}>Filter by Group</p>
          {uniqueGroups.map((g) => (
            <p
              key={g}
              onClick={() => setFilterGroup(filterGroup === g ? "" : g)}
              style={{
                cursor: "pointer",
                color: filterGroup === g ? "#e74c3c" : "#e74c3c",
                fontWeight: filterGroup === g ? "bold" : "normal",
                marginBottom: "6px",
                fontSize: "14px",
              }}
            >
              {g}
            </p>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px" }}>

        {/* Total Estimate Card */}
        <div style={{
          backgroundColor: "#e74c3c",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: "8px",
          display: "inline-block",
          marginBottom: "20px",
          minWidth: "160px",
        }}>
          <p style={{ margin: 0, fontSize: "14px" }}>Total Estimate</p>
          <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>{estimations.length}</p>
        </div>

        {/* Create Button */}
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={openAddModal}
            style={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            + Create Estimate
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                {["Sr.No", "Group", "Chain ID", "Brand", "Zone", "Service Details", "Total Units", "Price Per Unit", "Total", "Edit", "Delete"].map((h) => (
                  <th key={h} style={{ padding: "12px 10px", textAlign: "left", fontSize: "13px", color: "#555", fontWeight: "600", borderBottom: "1px solid #e0e0e0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "24px", color: "#aaa" }}>No estimations found.</td>
                </tr>
              ) : (
                filtered.map((est, idx) => (
                  <tr key={est.estimatedId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={td}>{idx + 1}</td>
                    <td style={td}>{est.groupName}</td>
                    <td style={td}>{est.chainId}</td>
                    <td style={td}>{est.brandName}</td>
                    <td style={td}>{est.zoneName}</td>
                    <td style={td}>{est.service}</td>
                    <td style={td}>{est.qty}</td>
                    <td style={td}>{est.costPerUnit}</td>
                    <td style={td}>{est.totalCost}</td>
                    <td style={td}>
                      <button onClick={() => openEditModal(est)} style={editBtn}>Edit</button>
                    </td>
                    <td style={td}>
                      <button onClick={() => confirmDelete(est.estimatedId)} style={deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>{isEditing ? "Update Estimate" : "Create Estimate"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

              {/* Left Column */}
              <div>
                <label style={label}>Select Group:</label>
                <select name="groupName" value={form.groupName} onChange={handleChange} style={input}>
                  <option value="">-- Select Group --</option>
                  {groups.map((g) => (
                    <option key={g.groupId} value={g.groupName}>{g.groupName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label}>Total Quantity:</label>
                <input name="qty" value={form.qty} onChange={handleChange} placeholder="Enter Total Qty" style={input} type="number" />
              </div>

              <div>
                <label style={label}>Select Chain ID or Company Name:</label>
                <select name="chainId" value={form.chainId} onChange={handleChange} style={input}>
                  <option value="">-- Select Chain --</option>
                  {chains.map((c) => (
                    <option key={c.chainId} value={c.chainId}>{c.chainName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label}>Cost Per Quantity:</label>
                <input name="costPerUnit" value={form.costPerUnit} onChange={handleChange} placeholder="Enter Cost Per Qty" style={input} type="number" />
              </div>

              <div>
                <label style={label}>Select Brand:</label>
                <select name="brandName" value={form.brandName} onChange={handleChange} style={input}>
                  <option value="">-- Select Brand --</option>
                  {brands.map((b) => (
                    <option key={b.brandId} value={b.brandName}>{b.brandName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label}>Estimated Amount in Rs:</label>
                <input name="totalCost" value={form.totalCost} onChange={handleChange} placeholder="Auto-calculated" style={{ ...input, backgroundColor: "#f9f9f9" }} type="number" readOnly />
              </div>

              <div>
                <label style={label}>Select Zone:</label>
                <select name="zoneName" value={form.zoneName} onChange={handleChange} style={input}>
                  <option value="">-- Select Zone --</option>
                  {zones.map((z) => (
                    <option key={z.zoneId} value={z.zoneName}>{z.zoneName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label}>Expected Delivery Date:</label>
                <input name="deliveryDate" value={form.deliveryDate} onChange={handleChange} style={input} type="date" />
              </div>

              <div>
                <label style={label}>Service Provided:</label>
                <input name="service" value={form.service} onChange={handleChange} placeholder="Enter Service" style={input} />
              </div>

              <div>
                <label style={label}>Other Delivery Details:</label>
                <textarea name="deliveryDetails" value={form.deliveryDetails} onChange={handleChange} placeholder="Enter delivery details..." style={{ ...input, height: "80px", resize: "vertical" }} />
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} style={submitBtn}>
                {isEditing ? "Update and Save Estimate" : "Create and Save Estimate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirm.show && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: "400px", textAlign: "center" }}>
            <h3 style={{ color: "#e74c3c", marginBottom: "12px" }}>Confirm Deletion</h3>
            <p style={{ color: "#555", marginBottom: "24px" }}>Are you sure you want to delete this estimate? This action cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button onClick={() => setDeleteConfirm({ show: false, id: null })} style={cancelBtn}>Cancel</button>
              <button onClick={handleDelete} style={{ ...submitBtn, backgroundColor: "#e74c3c" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Styles
const td = { padding: "12px 10px", fontSize: "13px", color: "#444" };
const editBtn = { backgroundColor: "#f39c12", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const deleteBtn = { backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const overlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modal = { backgroundColor: "#fff", borderRadius: "10px", padding: "32px", width: "90%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" };
const label = { display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" };
const input = { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", outline: "none" };
const submitBtn = { backgroundColor: "#2ecc71", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" };
const cancelBtn = { backgroundColor: "#bdc3c7", color: "#333", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" };