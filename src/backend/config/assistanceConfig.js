import dotenv from 'dotenv';

dotenv.config();

export const assistanceConfig = {
  dispatchTimeoutMs: parseInt(process.env.ASSISTANCE_DISPATCH_TIMEOUT_MS || '1000', 10),
  downstreamTimeoutMs: parseInt(process.env.DOWNSTREAM_TIMEOUT_MS || '3000', 10),
  maxQueueAddLimit: parseInt(process.env.ASSISTANCE_MAX_QUEUE_ADD || '50', 10),
  defaultVolumeDelta: parseInt(process.env.ASSISTANCE_DEFAULT_VOLUME_DELTA || '20', 10),
};

export default assistanceConfig;
