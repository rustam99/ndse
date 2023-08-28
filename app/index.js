import express from 'express';
import { config } from './config.js';
import { useRouter } from './router/index.js';
import { notFound } from './middleware/notFound.js';

const app = express();

app.use(express.json());
app.use(express.static('static'));

app.set('view engine', 'ejs');

useRouter(app);

app.use(notFound);

app.listen(config.PORT, () => `server start on port ${config.PORT}`);
