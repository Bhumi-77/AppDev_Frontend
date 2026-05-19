import API from './axiosConfig';

export const getAllInvoices = () => API.get('/purchaseinvoices');
export const getInvoiceById = (id) => API.get(`/purchaseinvoices/${id}`);
export const createInvoice = (data) => API.post('/purchaseinvoices', data);

// Staff Reports API
export const getStaffReports = () => API.get('/reports/staff');
export const getPendingCreditsReport = () => API.get('/reports/pending-credits');