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
});
