import { addComment } from '../controllers/bookComment/index.js';

export const bookComment = (socket) => {
    socket.on('add-comment', async (message, args, callback) => {
        try {
            const result = await addComment({ message, args, socket });

            if (typeof callback === 'function') callback(result);
        } catch (error) {
            if (typeof callback === 'function') callback(error);
        }
    });
}
