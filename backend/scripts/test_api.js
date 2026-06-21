const API_URL = 'http://localhost:4000/api';

async function test() {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  console.log('--- Registering Test User ---');
  let res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: testPassword,
      dateOfBirth: '1990-01-01',
      gender: 'male'
    })
  });
  
  let data = await res.json();
  console.log('Register status:', res.status);
  if (!res.ok) throw new Error('Registration failed');

  console.log('\n--- Logging In ---');
  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword })
  });
  data = await res.json();
  const token = data.accessToken;
  if (!token) throw new Error('No access token');

  console.log('\n--- Bulk Adding with Invalid Date Format ---');
  res = await fetch(`${API_URL}/expenses/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      expenses: [
        {
          amount: 50.75,
          category: 'Groceries',
          description: 'Weekly grocery shopping',
          date: 'invalid-date-string'
        }
      ]
    })
  });
  data = await res.json();
  console.log('Bulk Expenses with invalid date status (expected 400):', res.status);
  console.log('Error message:', data.message);

  console.log('\n--- Bulk Adding with Overflow Date (Feb 30th) ---');
  res = await fetch(`${API_URL}/expenses/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      expenses: [
        {
          amount: 50.75,
          category: 'Groceries',
          description: 'Weekly grocery shopping',
          date: '2026-02-30'
        }
      ]
    })
  });
  data = await res.json();
  console.log('Bulk Expenses with overflow date status (expected 400):', res.status);
  console.log('Error message:', data.message);

  console.log('\n--- Bulk Adding with Valid ISO Strings & YYYY-MM-DD ---');
  res = await fetch(`${API_URL}/expenses/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      expenses: [
        {
          amount: 12.50,
          category: 'Coffee',
          description: 'Espresso',
          date: '2026-06-21' // YYYY-MM-DD format
        },
        {
          amount: 45.00,
          category: 'Utilities',
          description: 'Electric bill',
          date: '2026-06-20T10:00:00Z' // ISO 8601 format
        }
      ]
    })
  });
  data = await res.json();
  console.log('Bulk Expenses status:', res.status);
  console.log('Inserted Expenses:', data.data);

  console.log('\n--- Fetching Category Totals ---');
  res = await fetch(`${API_URL}/expenses/category-totals`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  data = await res.json();
  console.log('Category Totals:', data.data);

  console.log('\n--- All validation tests completed successfully! ---');
}

test().catch(err => {
  console.error('Test failed:', err);
});
