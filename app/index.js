import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session'
import mongoose from 'mongoose';
import passport from 'passport'

import { config } from './config.js';
import { useRouter, useSocketRouter } from './router/index.js';
import { notFound } from './middleware/notFound.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static('static'));

const sessionMiddleware = session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

useRouter(app);
app.use(notFound);

(async function () {
    try {
        await mongoose.connect(config.MONGO_URL);

        io
            .use((socket, next) => {
                sessionMiddleware(socket.request, {}, next);
            })
            .on('connection', (socket) => {
                useSocketRouter(socket);
        });

        httpServer.listen(config.PORT, () => `server start on port ${config.PORT}`);
    } catch (e) {
        console.log(e);
    }
})();
