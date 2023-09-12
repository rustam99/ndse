export const checkAuth = (request, response, next) => {
    if (!request.isAuthenticated()) {
        return response.redirect('/user/login/');
    }

    next();
}
