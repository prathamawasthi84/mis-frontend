import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function ManageChains() {
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [totalChains, setTotalChains] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newChainName, setNewChainName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [editChainName, setEditChainName] = useState("");
  const [editChainId, setEditChainId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const fetchChains = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chains`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setChains(response.data);
      setTotalChains(response.data.length);
    } catch (err) {
      console.error("Failed to fetch chains", err);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer-groups`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setGroups(response.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  }, []);

  useEffect(() => {
    fetchChains();
    fetchGroups();
  }, [fetchChains, fetchGroups]);

  const handleAddChain = async () => {
    if (!newChainName.trim()) {
      setError("Chain name cannot be empty");
      return;
    }
    if (!selectedGroupId) {
      setError("Please select a group");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/chains`,
        { chainName: newChainName, groupId: selectedGroupId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setNewChainName("");
      setSelectedGroupId("");
      setError("");
      setShowAddModal(false);
      fetchChains();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Chain Already Exists!!!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (chain) => {
    setEditChainId(chain.chainId);
    setEditChainName(chain.chainName);
    setError("");
    setShowEditModal(true);
  };

  const handleUpdateChain = async () => {
    if (!editChainName.trim()) {
      setError("Chain name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/chains/${editChainId}`,
        { chainName: editChainName },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setError("");
      setShowEditModal(false);
      fetchChains();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Chain name already taken!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChain = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/chains/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchChains();
      navigate('/dashboard');
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
      {/* Total Chains Card */}
      <div style={{
        backgroundColor: "#e74c3c", borderRadius: "8px",
        padding: "1rem 1.5rem", display: "inline-block", marginBottom: "1.5rem"
      }}>
        <div style={{ color: "#fff", fontSize: "0.85rem" }}>Total Chains</div>
        <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>{totalChains}</div>
      </div>

      {/* Add Chain Button */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          className="btn btn-success btn-sm"
          onClick={() => { setShowAddModal(true); setError(""); setNewChainName(""); setSelectedGroupId(""); }}
        >
          Add Chain
        </button>
      </div>

      {/* Chains Table */}
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Chain Name</th>
            <th>Group</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {chains.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-secondary">No chains found</td>
            </tr>
          ) : (
            chains.map((chain, index) => (
              <tr key={chain.chainId}>
                <td>{index + 1}</td>
                <td>{chain.chainName}</td>
                <td>{chain.group?.groupName}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditClick(chain)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteChain(chain.chainId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add Chain Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Add New Chain:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              placeholder="Enter Unique Chain Name"
              value={newChainName}
              onChange={(e) => setNewChainName(e.target.value)}
            />
            <select
              className="form-control bg-secondary text-white border-0 mb-3"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map(group => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </option>
              ))}
            </select>
            {error && (
              <div style={{
                backgroundColor: "#f8d7da", color: "#842029",
                padding: "0.5rem 1rem", borderRadius: "4px", marginBottom: "1rem"
              }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-primary" onClick={handleAddChain} disabled={loading}>
                {loading ? "Adding..." : "Add Chain"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Chain Modal */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Edit Chain Name:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              value={editChainName}
              onChange={(e) => setEditChainName(e.target.value)}
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
              <button className="btn btn-primary" onClick={handleUpdateChain} disabled={loading}>
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

export default ManageChains;