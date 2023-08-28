import express from 'express';
import { createClient } from 'redis';
import { config } from './config.js';

const app = express();
const client = createClient({ url: config.REDIS_URL });

app.use(express.json());

client.on('error', err => console.log('Redis Client Error', err));

(async function () {
    await client.connect();

    app.post('/counter/:bookId/incr', async (req, res) => {
        const { bookId } = req.params;

        if (!bookId) return res.status(400).json({ code: 400, message: 'Не найден bookId' });

        try {
             const incr = await client.incr(bookId);

             res.json(incr);
        } catch (e) {
            res.status(500).json({ code: 500, message: e });
        }
    });

    app.get('/counter/:bookId', async (req, res) => {
        const { bookId } = req.params;

        if (!bookId) return res.status(400).json({ code: 400, message: 'Не найден bookId' });

        try {
            const incr = await client.get(bookId);

            res.json(Number(incr));
        } catch (e) {
            res.status(500).json({ code: 500, message: e });
        }
    });

    app.listen(config.PORT, () => `server counter start on port ${config.PORT}`);
})();
