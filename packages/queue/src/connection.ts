import IORedis from 'ioredis';
import { serverEnv } from '@velora/config';

/**
 * BullMQ için paylaşılan Redis bağlantısı.
 * `maxRetriesPerRequest: null` BullMQ tarafından zorunludur.
 */
let _connection: IORedis | null = null;

export function getConnection(): IORedis {
  if (!_connection) {
    _connection = new IORedis(serverEnv().REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
  }
  return _connection;
}
