import dotenv from 'dotenv';

dotenv.config();

export const agentConfig = {
  aiAgentServiceUrl: process.env.AI_AGENT_SERVICE_URL || 'http://localhost:8000',
  agentTimeoutMs: parseInt(process.env.AGENT_TIMEOUT_MS || '15000', 10),
  maxPromptLength: parseInt(process.env.AGENT_MAX_PROMPT_LENGTH || '500', 10),
  defaultStatus: process.env.AGENT_DEFAULT_STATUS || 'online',
};

export default agentConfig;
