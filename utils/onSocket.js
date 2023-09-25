export const onSocket = (eventName, socket, controllerFn, needAuth = false) => {
  socket.on(eventName, async (message, callback) => {
    try {
      if (needAuth && !socket.request?.session?.passport?.user) {
        return socket.disconnect()
      }

      const result = await controllerFn(message, socket)

      if (typeof callback === 'function') callback(result)
    } catch (error) {
      if (typeof callback === 'function') callback(error)
    }
  })
}
