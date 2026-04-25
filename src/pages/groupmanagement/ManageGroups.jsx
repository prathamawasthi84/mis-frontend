import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "https://web-production-1845c.up.railway.app";

function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const fetchGroups = useCallback(async () => {
  try {
    const response = await axios.get(`${API_URL}/api/customer-groups`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    setGroups(response.data);
    setTotalGroups(response.data.length);
  } catch (err) {
    console.error("Failed to fetch groups", err);
  }
}, []);
useEffect(() => {
  fetchGroups();
}, [fetchGroups]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/customer-groups`,
        { groupName: newGroupName },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setNewGroupName("");
      setError("");
      setShowAddModal(false);
      fetchGroups();
    } catch (err) {
      setError(err.response?.data || "Group Already Exists!!!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (group) => {
    setEditGroupId(group.groupId);
    setEditGroupName(group.groupName);
    setError("");
    setShowEditModal(true);
  };

  const handleUpdateGroup = async () => {
    if (!editGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/customer-groups/${editGroupId}`,
        { groupName: editGroupName },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setError("");
      setShowEditModal(false);
      fetchGroups();
    } catch (err) {
      setError(err.response?.data || "Group name already taken!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/customer-groups/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchGroups();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const modalOverlay = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center"
  };

  const modalBox = {
    backgroundColor: "#1a1a2e", border: "1px solid #2a2a3e",
    borderRadius: "8px", padding: "2rem", width: "400px"
  };

  return (
    <div>
      {/* Total Groups Card */}
      <div style={{
        backgroundColor: "#e74c3c", borderRadius: "8px",
        padding: "1rem 1.5rem", display: "inline-block", marginBottom: "1.5rem"
      }}>
        <div style={{ color: "#fff", fontSize: "0.85rem" }}>Total Groups</div>
        <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>{totalGroups}</div>
      </div>

      {/* Add Group Button */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          className="btn btn-success btn-sm"
          onClick={() => { setShowAddModal(true); setError(""); setNewGroupName(""); }}
        >
          Add Group
        </button>
      </div>

      {/* Groups Table */}
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Group Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-secondary">No groups found</td>
            </tr>
          ) : (
            groups.map((group, index) => (
              <tr key={group.groupId}>
                <td>{index + 1}</td>
                <td>{group.groupName}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditClick(group)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteGroup(group.groupId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add Group Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Enter Group Name:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              placeholder="Enter Unique Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            {error && (
              <div style={{
                backgroundColor: "#f8d7da", color: "#842029",
                padding: "0.5rem 1rem", borderRadius: "4px", marginBottom: "1rem"
              }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-primary" onClick={handleAddGroup} disabled={loading}>
                {loading ? "Adding..." : "Add Group"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Edit Group Name:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
            />
            {error && (
              <div style={{
                backgroundColor: "#f8d7da", color: "#842029",
                padding: "0.5rem 1rem", borderRadius: "4px", marginBottom: "1rem"
              }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-primary" onClick={handleUpdateGroup} disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageGroups;