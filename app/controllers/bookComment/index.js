import { bookCommentsModel } from '../../models/bookComments.js';

export const addComment = async ({ socket, message }) => {
    try {
        const user = socket.request?.session?.passport?.user;
        const bookId = message?.bookId;

        if (!user || !bookId) return;

        const createdComment = await bookCommentsModel.create({ user: user.id, book: bookId, comment: message.comment });

        if (!createdComment) {
            return { status: false, message: 'Cant create comment' }
        }

        const emitMessage = {
            displayName: user.displayName,
            date: createdComment.date,
            comment: message.comment,
        }

        socket.broadcast.emit('new-comment', emitMessage);
        socket.emit('new-comment', emitMessage);

        return { status: true }
    } catch (error) {
        return { status: false, message: error }
    }
}
