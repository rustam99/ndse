document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });

    const apiEndpoint = '/api/books/';

    // Create, Edit
    (function () {
        const form = document.querySelector('.js-form');
        let method = '';
        let id = '';

        if (!form) return;
        const formParent = form.parentElement;

        if (formParent.classList.contains('js-createBook')) {
            method = 'POST';
        } else if (formParent.classList.contains('js-updateBook')) {
            method = 'PUT';
            id = formParent.dataset.id;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            fetch(`${apiEndpoint}${id}`, {
                method: method,
                body: formData,
            })
                .then(r => r.json())
                .then(() => {
                    window.location.href = '/';
                });

            e.preventDefault();
        });
    })();

    // Remove
    (function () {
        const form = document.querySelector('.js-removeBook');

        if (!form) return;

        const id = form.dataset.id;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            fetch(`${apiEndpoint}${id}`, {
                method: 'DELETE',
            })
                .then(r => r.json())
                .then(() => {
                    const removeItem = form.closest('.js-removeItem');

                    if (!removeItem) document.location.href = '/';

                    removeItem.remove();
                });
        });
    })();

    // Login, Signup
    (function () {
        document.body.addEventListener('submit', (e) => {
            e.preventDefault();

            const target = e.target;

            if (!(target instanceof HTMLFormElement) && !target.classList.contains('.js-auth')) return

            const data = new FormData(target);

            if (target.classList.contains('js-signup')) {
                fetch('/api/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(data)),
                })
                    .then(r => r.json())
                    .then((res) => {
                        console.log(res);

                        if (res?.message === 'UserExistsError') {
                            return alert('Пользователь с таким именем уже зарегистрирован');
                        }

                        document.location.href = '/';
                    })
                    .catch((res) => {
                        console.log(res);
                    });
            } else if (target.classList.contains('js-login')) {
                fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(data)),
                })
                    .then(res => {
                        if (res.status === 401) {
                            alert('Не верный логин или пароль');
                        } else {
                            document.location.href = '/';
                        }
                    })
                    .catch((res) => {
                        console.log(res);
                    });
            }
        });
    })();

    // Logout
    (function () {
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            if (!target?.classList?.contains('js-logout')) return;

            fetch('/api/user/logout', {
                method: 'POST',
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    }
                })
                .then(res => {
                    document.location.href = '/';
                })
                .catch(console.log);
        });
    })();

    // Comments
    (function () {
        if (!document.querySelector('.js-view') || typeof io === 'undefined') return;

        const socket = io.connect('/');

        document.body.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!e.target?.classList.contains('js-sendComments')) return;

            const value = document.querySelector('#comment').value.trim();

            if (value.length < 1) return;

            socket.emit('add-comment', {
                comment: value,
                bookId: location.pathname.split('/')[2],
            }, {}, (response) => {
                if (!response.status) {
                    alert('Не удалось отправить комментарий, повторит попытку');
                } else {
                    document.querySelector('#comment').value = '';
                }
            });
        });

        socket.on('new-comment', ({ displayName, date, comment }) => {
            if (!displayName || !date || !comment) return;

            const template = commentTemplateString(displayName, date, comment);

            document
                .querySelector('.js-comments')
                .insertAdjacentHTML('beforeend', template);
        });

        function commentTemplateString(displayName, date, comment) {
            return `<div class="toast show mb-3" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                            <strong class="me-auto">${displayName}</strong>
                            <small>${new Intl.DateTimeFormat('ru').format(new Date(date))}</small>
                        </div>
                        <div class="toast-body">${comment}</div>
                    </div>`;
        }
    })();
});
