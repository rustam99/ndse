import { fromFetch } from 'rxjs/fetch'
import { catchError, of, switchMap, filter, throwIfEmpty } from 'rxjs'

const ownerNdseRepologin$ = fromFetch('https://api.github.com/search/repositories?q=ndse')
  .pipe(
    switchMap((response) => {
      if (!response.ok) {
        const error = new Error(response.status)
        error.text = response.statusText
        throw error
      }

      return response.json()
    }),
    switchMap((data) => data.items),
    throwIfEmpty(() => new Error('Repositories are empty')),
    filter((repo) => repo.owner.login === 'rustam99'),
    throwIfEmpty(() => new Error('User login not found')),
    switchMap((repo) => fromFetch(`https://api.github.com/users/${repo.owner.login}`)),
    switchMap((response) => response.json()),
    catchError(err => {
      console.error(err);

      return of({ error: err.message, code: err.text })
    })
  )

ownerNdseRepologin$.subscribe({
  next(value) {
    console.log(value)
  },
  error(err) {
    console.log(err)
  }
})