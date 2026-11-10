
import cloudinary from '../config/cloudinary.js';

async function testConnection() {
  try {
    console.log('Testing Cloudinary connection...');

    const response = await cloudinary.api.ping();

    console.log('Cloudinary response:', response);

    if (response.status === 'ok') {
      console.log('Cloudinary connection successful!');
    } else {
      console.error('Unexpected response status');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Cloudinary connection failed');

    console.error('Error details:', {
      message: error?.message,
      http_code: error?.http_code,
      name: error?.name,
      error: error?.error,
      status: error?.status
    });

    process.exitCode = 1;
  }
}

testConnection();
