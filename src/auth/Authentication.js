// Example auth functions - replace fetch URLs & logic with your backend

// Register user
export async function register(email, password, confirmPassword) {
  if (!email.includes('@')) throw new Error('Invalid email');
  if (password.length < 6) throw new Error('Password too short');
  if (password !== confirmPassword) throw new Error('Passwords do not match');

  // Replace with your API call
  const response = await fetch('https://yourapi.com/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return await response.json();
}

// Login user
export async function login(email, password) {
  if (!email.includes('@')) throw new Error('Invalid email');
  if (password.length < 6) throw new Error('Password too short');

  // Replace with your API call
  const response = await fetch('https://yourapi.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  // e.g., save token/session here if needed
  return data;
}

// Logout user (clear session/token)
export function logout() {
  // Clear tokens, session, local storage etc.
  // e.g. AsyncStorage.removeItem('authToken');
  return Promise.resolve(); // or any async cleanup
}

// Forgot password (send reset email)
export async function forgotPassword(email) {
  if (!email.includes('@')) throw new Error('Invalid email');

  // Replace with your API call
  const response = await fetch('https://yourapi.com/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send reset email');
  }

  return await response.json();
}
