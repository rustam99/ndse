import express from 'express';
import mongoose from 'mongoose';
import { config } from './config.js';
import { useRouter } from './router/index.js';
import { notFound } from './middleware/notFound.js';

const app = express();

app.use(express.json());
app.use(express.static('static'));

app.set('view engine', 'ejs');

useRouter(app);

app.use(notFound);

(async function () {
    try {
        await mongoose.connect(config.MONGO_URL);
        app.listen(config.PORT, () => `server start on port ${config.PORT}`);
    } catch (e) {
        console.log(e);
    }
})();
