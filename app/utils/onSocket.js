export const onSocket = (eventName, socket, controllerFn) => {
  socket.on(eventName, async (message, callback) => {
    try {
      const result = await controllerFn(message, socket)

      if (typeof callback === 'function') callback(result)
    } catch (error) {
      if (typeof callback === 'function') callback(error)
    }
  })
}
