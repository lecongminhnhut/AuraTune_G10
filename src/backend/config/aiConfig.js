import dotenv from 'dotenv';

dotenv.config();

export const aiConfig = {
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  aiServiceTimeoutMs: parseInt(process.env.AI_SERVICE_TIMEOUT_MS || '2500', 10),
  internalSecret: process.env.AI_INTERNAL_SECRET || 'auratune-internal-secret-2026',
};

export const AI_SERVICE_URL = aiConfig.aiServiceUrl;
export const AI_SERVICE_TIMEOUT_MS = aiConfig.aiServiceTimeoutMs;

export default aiConfig;
