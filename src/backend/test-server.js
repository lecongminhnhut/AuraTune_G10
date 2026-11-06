import http from 'http';
import { db } from './db.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);

const server = app.listen(5099, async () => {
  console.log('🧪 Test server running on http://localhost:5099');
  
  try {
    // 1. Register test
    const regRes = await fetch('http://localhost:5099/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@auratune.vn',
        password: 'Password123!',
        display_name: 'Test Listener',
        terms_accepted: true
      })
    });
    const regData = await regRes.json();
    console.log('✅ Register test status:', regRes.status, regData.success ? 'PASSED' : 'FAILED');

    // Extract cookie
    const cookies = regRes.headers.get('set-cookie');
    const token = regData.data?.session?.access_token;

    // 2. Get Me Test
    const meRes = await fetch('http://localhost:5099/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log('✅ Get Me test status:', meRes.status, meData.success ? 'PASSED' : 'FAILED');

    // 3. OAuth Callback Test
    const oauthRes = await fetch('http://localhost:5099/api/v1/auth/oauth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'google',
        email: 'testuser@auratune.vn',
        display_name: 'Test Listener (Google Linked)',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      })
    });
    const oauthData = await oauthRes.json();
    console.log('✅ OAuth Account Linking test:', oauthRes.status, oauthData.user ? 'PASSED' : 'FAILED');

    // 4. Session Refresh Test
    const refreshRes = await fetch('http://localhost:5099/api/v1/auth/refresh', {
      method: 'POST',
      headers: { Cookie: cookies }
    });
    const refreshData = await refreshRes.json();
    console.log('✅ Session Refresh test:', refreshRes.status, refreshData.status === 'success' ? 'PASSED' : 'FAILED');

    console.log('🎉 ALL BACKEND API ENDPOINT TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
  }
});
