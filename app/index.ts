import express from 'express';
import mongoose from 'mongoose';
import 'reflect-metadata'
import { config } from './config';
import { useRouter } from './router';
import { notFound } from './middleware/notFound'

const app = express();

app.use(express.json());
app.use(express.static('static'));

app.set('view engine', 'ejs');

useRouter(app);

app.use(notFound);

(async function () {
    if (!config.MONGO_URL) throw new Error('MONGO_URL is not Found')

    try {
        await mongoose.connect(config.MONGO_URL);

        app.listen(config.PORT, () => `server start on port ${config.PORT}`);
    } catch (e) {
        console.log(e);
    }
})();
