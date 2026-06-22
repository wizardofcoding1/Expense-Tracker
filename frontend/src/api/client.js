import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',   // fallback to proxy in dev
  withCredentials: true,
});


let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

// Sync manager state
let syncingInProgress = false;

// Sync offline transactions to backend
export const syncOfflineData = async () => {
  if (syncingInProgress) return;

  const offlineExpenses = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
  const offlineIncomes = JSON.parse(localStorage.getItem('offline_incomes') || '[]');

  if (offlineExpenses.length === 0 && offlineIncomes.length === 0) {
    return;
  }

  const token = getAccessToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  syncingInProgress = true;
  try {
    // 1. Sync expenses
    if (offlineExpenses.length > 0) {
      const payload = offlineExpenses.map(item => ({
        amount: Number(item.amount),
        category: item.category,
        description: item.description,
        date: item.date
      }));
      await axios.post(`${import.meta.env.VITE_API_URL}/api/expenses/bulk`, { expenses: payload }, { withCredentials: true, headers });
      localStorage.setItem('offline_expenses', '[]');
    }

    // 2. Sync incomes
    if (offlineIncomes.length > 0) {
      const payload = offlineIncomes.map(item => ({
        amount: Number(item.amount),
        source: item.category || item.source,
        description: item.description,
        date: item.date
      }));
      await axios.post(`${import.meta.env.VITE_API_URL}/api/incomes/bulk`, { incomes: payload }, { withCredentials: true, headers });
      localStorage.setItem('offline_incomes', '[]');
    }

    // Dispatch event to reload UI in parent components
    window.dispatchEvent(new Event('offline-sync-completed'));
  } catch (err) {
    console.error('Failed to sync offline data:', err);
  } finally {
    syncingInProgress = false;
  }
};

// Listen to browser network changes
window.addEventListener('online', syncOfflineData);

// Request interceptor to attach access Token
API.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle token refresh & cache online queries
API.interceptors.response.use(
  (response) => {
    const { url, method } = response.config;

    // Set token immediately on successful auth requests
    if (url && (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh'))) {
      if (response.data?.success && response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
      }
    }

    // Cache successful queries
    if (method === 'get') {
      if (url === '/expenses' || url.endsWith('/expenses')) {
        localStorage.setItem('cached_expenses', JSON.stringify(response.data.data || []));
      } else if (url === '/incomes' || url.endsWith('/incomes')) {
        localStorage.setItem('cached_incomes', JSON.stringify(response.data.data || []));
      } else if (url.includes('/budgets/status')) {
        localStorage.setItem('cached_budget_status', JSON.stringify(response.data.data || []));
      } else if (url.includes('/budgets/compare')) {
        localStorage.setItem('cached_budget_compare', JSON.stringify(response.data.data || []));
      }
    }

    // Check if offline sync is needed whenever we successfully talk to backend
    const hasPendingData =
      (localStorage.getItem('offline_expenses') && localStorage.getItem('offline_expenses') !== '[]') ||
      (localStorage.getItem('offline_incomes') && localStorage.getItem('offline_incomes') !== '[]');

    if (hasPendingData) {
      syncOfflineData();
    }

    return response;
  },
  
  async (error) => {
    const originalRequest = error.config;

    // Check for network connectivity loss (backend offline)
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK';
    if (isNetworkError && originalRequest) {
      const url = originalRequest.url;
      const method = originalRequest.method;

      // 1. MOCK GET ENDPOINTS WHEN OFFLINE
      if (method === 'get') {
        if (url === '/expenses' || url.endsWith('/expenses')) {
          const cached = JSON.parse(localStorage.getItem('cached_expenses') || '[]');
          const offline = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
          const merged = [...offline, ...cached];
          merged.sort((a, b) => new Date(b.date) - new Date(a.date));
          return { data: { success: true, data: merged, offline: true } };
        }

        if (url === '/incomes' || url.endsWith('/incomes')) {
          const cached = JSON.parse(localStorage.getItem('cached_incomes') || '[]');
          const offline = JSON.parse(localStorage.getItem('offline_incomes') || '[]');
          const mappedOffline = offline.map(item => ({
            ...item,
            category: item.category || item.source
          }));
          const merged = [...mappedOffline, ...cached];
          merged.sort((a, b) => new Date(b.date) - new Date(a.date));
          return { data: { success: true, data: merged, offline: true } };
        }

        if (url.includes('/analytics/summary')) {
          const queryParams = new URLSearchParams(url.split('?')[1] || '');
          const reqMonth = Number(queryParams.get('month') || new Date().getMonth() + 1);
          const reqYear = Number(queryParams.get('year') || new Date().getFullYear());

          const expensesCached = JSON.parse(localStorage.getItem('cached_expenses') || '[]');
          const expensesOffline = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
          const allExpenses = [...expensesOffline, ...expensesCached];

          const incomesCached = JSON.parse(localStorage.getItem('cached_incomes') || '[]');
          const incomesOffline = JSON.parse(localStorage.getItem('offline_incomes') || '[]');
          const allIncomes = [...incomesOffline, ...incomesCached];

          const filteredExpenses = allExpenses.filter(item => {
            const d = new Date(item.date);
            return (d.getMonth() + 1) === reqMonth && d.getFullYear() === reqYear;
          });

          const filteredIncomes = allIncomes.filter(item => {
            const d = new Date(item.date);
            return (d.getMonth() + 1) === reqMonth && d.getFullYear() === reqYear;
          });

          const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
          const totalIncome = filteredIncomes.reduce((sum, item) => sum + Number(item.amount), 0);
          const netSavings = totalIncome - totalExpense;

          return { data: { success: true, data: { totalIncome, totalExpense, netSavings }, offline: true } };
        }

        if (url.includes('/budgets/status')) {
          const queryParams = new URLSearchParams(url.split('?')[1] || '');
          const reqMonth = Number(queryParams.get('month') || new Date().getMonth() + 1);
          const reqYear = Number(queryParams.get('year') || new Date().getFullYear());

          const cachedStatus = JSON.parse(localStorage.getItem('cached_budget_status') || '[]');
          const offlineExpenses = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
          const currentOffline = offlineExpenses.filter(item => {
            const d = new Date(item.date);
            return (d.getMonth() + 1) === reqMonth && d.getFullYear() === reqYear;
          });

          const updatedStatus = cachedStatus.map(b => {
            const matchingOffline = currentOffline.filter(item => item.category?.toLowerCase() === b.category?.toLowerCase());
            const offlineSpent = matchingOffline.reduce((sum, item) => sum + Number(item.amount), 0);
            const spent_amount = Number(b.spent_amount) + offlineSpent;
            const remaining_amount = Number(b.limit_amount) - spent_amount;
            return { ...b, spent_amount, remaining_amount };
          });

          return { data: { success: true, data: updatedStatus, offline: true } };
        }

        if (url.includes('/budgets/compare')) {
          const cachedCompare = JSON.parse(localStorage.getItem('cached_budget_compare') || '[]');
          return { data: { success: true, data: cachedCompare, offline: true } };
        }
      }

      // 2. MOCK POST ENDPOINTS WHEN OFFLINE (QUEUE TRANSACTIONS)
      if (method === 'post') {
        if (url === '/expenses' || url.endsWith('/expenses')) {
          const payload = JSON.parse(originalRequest.data || '{}');
          const mockExpense = {
            id: 'offline_exp_' + Date.now(),
            amount: Number(payload.amount),
            category: payload.category || 'Other',
            description: payload.description || '',
            date: payload.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
          };

          const offline = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
          offline.push(mockExpense);
          localStorage.setItem('offline_expenses', JSON.stringify(offline));

          return { data: { success: true, message: "Expense logged offline", data: mockExpense, offline: true } };
        }

        if (url === '/incomes' || url.endsWith('/incomes')) {
          const payload = JSON.parse(originalRequest.data || '{}');
          const mockIncome = {
            id: 'offline_inc_' + Date.now(),
            amount: Number(payload.amount),
            source: payload.source || 'Other',
            category: payload.source || 'Other',
            description: payload.description || '',
            date: payload.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
          };

          const offline = JSON.parse(localStorage.getItem('offline_incomes') || '[]');
          offline.push(mockIncome);
          localStorage.setItem('offline_incomes', JSON.stringify(offline));

          return { data: { success: true, message: "Income logged offline", data: mockIncome, offline: true } };
        }
      }

      // 3. MOCK DELETE REQUESTS (PERMIT DELETING LOCAL QUEUED ITEMS OFFLINE)
      if (method === 'delete') {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        if (id && id.startsWith('offline_')) {
          if (url.includes('/expenses')) {
            const offline = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
            const filtered = offline.filter(item => item.id !== id);
            localStorage.setItem('offline_expenses', JSON.stringify(filtered));
            return { data: { success: true, message: "Offline queued expense deleted", data: { id }, offline: true } };
          }
          if (url.includes('/incomes')) {
            const offline = JSON.parse(localStorage.getItem('offline_incomes') || '[]');
            const filtered = offline.filter(item => item.id !== id);
            localStorage.setItem('offline_incomes', JSON.stringify(filtered));
            return { data: { success: true, message: "Offline queued income deleted", data: { id }, offline: true } };
          }
        } else {
          return Promise.reject(new Error("Cannot delete online records while offline."));
        }
      }
    }

    // Checking If Status is 401 and Not Already Retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/register' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;

        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (error) {
        setAccessToken('');
        window.dispatchEvent(new Event('auth-expired'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default API;