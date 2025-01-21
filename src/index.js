import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExist } from './utils/createDirIfNotExist.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../src/constants/index.js';

const boostrap = async () => {
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOAD_DIR);
  await initMongoConnection();
  setupServer();
};
boostrap();
