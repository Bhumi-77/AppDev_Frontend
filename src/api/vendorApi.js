import API from './axiosConfig';

// GET all vendors
export const getAllVendors = () => API.get('/vendors');

// GET vendor by id
export const getVendorById = (id) => API.get(`/vendors/${id}`);

// POST create vendor
export const createVendor = (data) => API.post('/vendors', data);

// PUT update vendor
export const updateVendor = (id, data) => API.put(`/vendors/${id}`, data);

// DELETE vendor
export const deleteVendor = (id) => API.delete(`/vendors/${id}`);
