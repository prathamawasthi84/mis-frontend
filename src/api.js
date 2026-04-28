export const getAllZones = () => axios.get(`${API_BASE}/api/zones`, authHeader());
export const addZone = (data) => axios.post(`${API_BASE}/api/zones`, data, authHeader());
export const updateZone = (id, data) => axios.put(`${API_BASE}/api/zones/${id}`, data, authHeader());
export const deleteZone = (id) => axios.delete(`${API_BASE}/api/zones/${id}`, authHeader());
export const getAllBrands = () => axios.get(`${API_BASE}/api/brands`, authHeader()); // already exists
export const getAllZones = () => axios.get(`${API_BASE}/api/zones`, authHeader());
export const addZone = (data) => axios.post(`${API_BASE}/api/zones`, data, authHeader());
export const updateZone = (id, data) => axios.put(`${API_BASE}/api/zones/${id}`, data, authHeader());
export const deleteZone = (id) => axios.delete(`${API_BASE}/api/zones/${id}`, authHeader());
export const getAllEstimations = () => axios.get(`${BASE_URL}/api/estimations`, config());
export const addEstimation = (data) => axios.post(`${BASE_URL}/api/estimations`, data, config());
export const updateEstimation = (id, data) => axios.put(`${BASE_URL}/api/estimations/${id}`, data, config());
export const deleteEstimation = (id) => axios.delete(`${BASE_URL}/api/estimations/${id}`, config());