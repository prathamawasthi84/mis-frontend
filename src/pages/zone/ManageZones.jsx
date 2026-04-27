import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function ManageZones() {
  const [zones, setZones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalZones, setTotalZones] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [editZoneId, setEditZoneId] = useState(null);
  const [editZoneName, setEditZoneName] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterBrand, setFilterBrand] = useState(null);
  const [filterCompany, setFilterCompany] = useState(null);
  const [filterGroup, setFilterGroup] = useState(null);

  const navigate = useNavigate();
  const getToken = () => localStorage.getItem("token");

  const fetchZones = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/zones`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setZones(response.data);
      setTotalZones(response.data.length);
    } catch (err) {
      console.error("Failed to fetch zones", err);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/brands`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBrands(response.data);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  }, []);

  useEffect(() => {
    fetchZones();
    fetchBrands();
  }, [fetchZones, fetchBrands]);

  // Derived filter options
  const uniqueBrands = [...new Set(zones.map(z => z.brandName))];
  const uniqueCompanies = [...new Set(zones.map(z => z.companyName))];
  const uniqueGroups = [...new Set(zones.map(z => z.groupName))];

  // Filtered list
  const filtered = zones.filter(z => {
    if (filterBrand && z.brandName !== filterBrand) return false;
    if (filterCompany && z.companyName !== filterCompany) return false;
    if (filterGroup && z.groupName !== filterGroup) return false;
    return true;
  });

  const handleAddZone = async () => {
    if (!newZoneName.trim()) { setError("Zone name cannot be empty"); return; }
    if (!selectedBrandId) { setError("Please select a brand"); return; }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/zones`,
        { zoneName: newZoneName, brandId: selectedBrandId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setNewZoneName("");
      setSelectedBrandId("");
      setError("");
      setShowAddModal(false);
      fetchZones();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Zone Already Exists!!!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (zone) => {
    setEditZoneId(zone.zoneId);
    setEditZoneName(zone.zoneName);
    setEditBrandId(zone.brandId);
    setError("");
    setShowEditModal(true);
  };

  const handleUpdateZone = async () => {
    if (!editZoneName.trim()) { setError("Zone name cannot be empty"); return; }
    if (!editBrandId) { setError("Please select a brand"); return; }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/zones/${editZoneId}`,
        { zoneName: editZoneName, brandId: editBrandId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setError("");
      setShowEditModal(false);
      fetchZones();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Zone name already taken!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/zones/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchZones();
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
    <div style={{ display: "flex", gap: "2rem" }}>

      {/* Left — Table Section */}
      <div style={{ flex: 1 }}>
        {/* Total Zones Card */}
        <div style={{
          backgroundColor: "#e74c3c", borderRadius: "8px",
          padding: "1rem 1.5rem", display: "inline-block", marginBottom: "1.5rem"
        }}>
          <div style={{ color: "#fff", fontSize: "0.85rem" }}>Total Zones</div>
          <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>{totalZones}</div>
        </div>

        {/* Add Zone Button */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            className="btn btn-success btn-sm"
            onClick={() => { setShowAddModal(true); setError(""); setNewZoneName(""); setSelectedBrandId(""); }}
          >
            Add Zone
          </button>
        </div>

        {/* Zones Table */}
        <table className="table table-dark table-bordered table-hover">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Zone</th>
              <th>Brand</th>
              <th>Company</th>
              <th>Group</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-secondary">No zones found</td>
              </tr>
            ) : (
              filtered.map((zone, index) => (
                <tr key={zone.zoneId}>
                  <td>{index + 1}</td>
                  <td>{zone.zoneName}</td>
                  <td>{zone.brandName}</td>
                  <td>{zone.companyName}</td>
                  <td>{zone.groupName}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(zone)}>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteZone(zone.zoneId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Right — Filter Sidebar */}
      <div style={{ width: "180px", paddingTop: "1rem" }}>
        <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "0.5rem" }}>Filter by Brand</div>
        {uniqueBrands.map(b => (
          <div key={b}
            onClick={() => setFilterBrand(filterBrand === b ? null : b)}
            style={{ color: filterBrand === b ? "#e74c3c" : "#6ea8fe", cursor: "pointer", marginBottom: "0.3rem" }}
          >
            {b}
          </div>
        ))}

        <div style={{ color: "#fff", fontWeight: "bold", margin: "1rem 0 0.5rem" }}>Filter by Company</div>
        {uniqueCompanies.map(c => (
          <div key={c}
            onClick={() => setFilterCompany(filterCompany === c ? null : c)}
            style={{ color: filterCompany === c ? "#e74c3c" : "#6ea8fe", cursor: "pointer", marginBottom: "0.3rem" }}
          >
            {c}
          </div>
        ))}

        <div style={{ color: "#fff", fontWeight: "bold", margin: "1rem 0 0.5rem" }}>Filter by Group</div>
        {uniqueGroups.map(g => (
          <div key={g}
            onClick={() => setFilterGroup(filterGroup === g ? null : g)}
            style={{ color: filterGroup === g ? "#e74c3c" : "#6ea8fe", cursor: "pointer", marginBottom: "0.3rem" }}
          >
            {g}
          </div>
        ))}
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Add New Zone:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              placeholder="Enter Zone Name"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
            <select
              className="form-control bg-secondary text-white border-0 mb-3"
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
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
              <button className="btn btn-primary" onClick={handleAddZone} disabled={loading}>
                {loading ? "Adding..." : "Add Zone"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Zone Modal */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h5 style={{ color: "#fff", marginBottom: "1rem" }}>Edit Zone:</h5>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 mb-3"
              value={editZoneName}
              onChange={(e) => setEditZoneName(e.target.value)}
            />
            <select
              className="form-control bg-secondary text-white border-0 mb-3"
              value={editBrandId}
              onChange={(e) => setEditBrandId(e.target.value)}
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
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
              <button className="btn btn-primary" onClick={handleUpdateZone} disabled={loading}>
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

export default ManageZones;