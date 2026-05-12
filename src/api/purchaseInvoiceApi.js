import API from './axiosConfig';

export const getAllInvoices = () => API.get('/purchaseinvoices');
export const getInvoiceById = (id) => API.get(`/purchaseinvoices/${id}`);
export const createInvoice = (data) => API.post('/purchaseinvoices', data);