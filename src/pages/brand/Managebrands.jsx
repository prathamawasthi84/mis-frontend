import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function ManageBrands() {
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [totalBrands, setTotalBrands] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [editBrandName, setEditBrandName] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/brands`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBrands(response.data);
      setTotalBrands(response.data.length);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  }, []);

  const fetchChains = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chains`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setChains(response.data);
    } catch (err) {
      console.error("Failed to fetch chains", err);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchChains();
  }, [fetchBrands, fetchChains]);

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setError("Brand name cannot be empty");
      return;
    }
    if (!selectedChainId) {
      setError("Please select a chain");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/brands`,
        { brandName: newBrandName, chainId: selectedChainId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setNewBrandName("");
      setSelectedChainId("");
      setError("");
      setShowAddModal(false);
      fetchBrands();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Brand Already Exists!!!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (brand) => {
    setEditBrandId(brand.brandId);
    setEditBrandName(brand.brandName);
    setError("");
    setShowEditModal(true);
  };

  const handleUpdateBrand = async () => {
    if (!editBrandName.trim()) {
      setError("Brand name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/brands/${editBrandId}`,
        { brandName: editBrandName },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setError("");
      setShowEditModal(false);
      fetchBrands();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Brand name already taken!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/brands/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchBrands();
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
      {/* Total Brands Card */}
      <div style={{
        backgroundColor: "#e74c3c", borderRadius: "8px",
        padding: "1rem 1.5rem", display: "inline-block", marginBottom: "1.5rem"
      }}>
        <div style={{ color: "#fff", fontSize: "0.85rem" }}>Total Brands</div>
        <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>{totalBrands}</div>
      </div>

      {/* Add Brand Button */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          className="btn btn-success btn-sm"
          onClick={() => { setShowAddModal(true); setError(""); setNewBrandName(""); setSelectedChainId(""); }}
        >
          Add Brand
        </button>
      </div>

      {/* Brands Table */}
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Brand Name</th>
            <th>Chain</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {brands.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-secondary">No brands found</td>
            </tr>
          ) : (
            brands.map((brand, index) => (
              <tr key={brand.brandId}>
                <td>{index + 1}</td>
                <td>{brand.brandName}</td>
                <td>{brand.chain?.chainName}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditClick(brand)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteBrand(brand.brandId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Add New Brand:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              placeholder="Enter Unique Brand Name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <select
              className="form-control bg-secondary text-white border-0 mb-3"
              value={selectedChainId}
              onChange={(e) => setSelectedChainId(e.target.value)}
            >
              <option value="">Select Chain</option>
              {chains.map(chain => (
                <option key={chain.chainId} value={chain.chainId}>
                  {chain.chainName}
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
              <button className="btn btn-primary" onClick={handleAddBrand} disabled={loading}>
                {loading ? "Adding..." : "Add Brand"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Edit Brand Name:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              value={editBrandName}
              onChange={(e) => setEditBrandName(e.target.value)}
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
              <button className="btn btn-primary" onClick={handleUpdateBrand} disabled={loading}>
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

export default ManageBrands;