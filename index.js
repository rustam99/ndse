import express from 'express';
import { config } from './config.js';
import { useRouter } from './router/index.js';

const app = express();

app.use(express.json());

useRouter(app);

app.listen(config.PORT, () => `server start on port ${config.PORT}`);
