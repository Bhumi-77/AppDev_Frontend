import API from './axiosConfig';

export const getAllParts = () => API.get('/parts');
export const getPartById = (id) => API.get(`/parts/${id}`);
export const createPart = (data) => API.post('/parts', data);
export const updatePart = (id, data) => API.put(`/parts/${id}`, data);
export const deletePart = (id) => API.delete(`/parts/${id}`);
export const getLowStockParts = () => API.get('/parts/low-stock');