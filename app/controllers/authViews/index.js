export const login = (request, response) => {
    response.render('../views/auth/login.ejs', {
        title: 'Логин',
        isAuth: request.isAuthenticated(),
    });
}

export const profile = (request, response) => {
    response.render('../views/auth/profile.ejs', {
        title: 'Профиль',
        isAuth: request.isAuthenticated(),
        user: request.user,
    });
}
