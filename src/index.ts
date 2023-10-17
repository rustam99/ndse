import express from 'express';
import { config } from './config'
import { useRouter } from './router'

const app = express();

app.use(express.json());

useRouter(app);

app.listen(config.PORT, () => `server start on port ${config.PORT}`);