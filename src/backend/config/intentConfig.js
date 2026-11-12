import dotenv from 'dotenv';

dotenv.config();

export const intentConfig = {
  aiIntentServiceUrl: process.env.AI_INTENT_SERVICE_URL || 'http://localhost:8000',
  intentTimeoutMs: parseInt(process.env.INTENT_TIMEOUT_MS || '1200', 10),
  intentConfidenceThreshold: parseFloat(process.env.INTENT_CONFIDENCE_THRESHOLD || '0.7'),
  maxPromptLength: parseInt(process.env.INTENT_MAX_PROMPT_LENGTH || '500', 10),
};

export default intentConfig;
