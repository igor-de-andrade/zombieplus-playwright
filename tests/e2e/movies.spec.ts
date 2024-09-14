import { test } from '../support/index.js';
import data from '../support/fixtures/movies.json'
import { executeSQL } from '../support/database.js';

test.beforeEach(async ({ play }) => {
    await play.login.visit()
    await play.login.submitLogin('admin@zombieplus.com', 'pwd123')
    await play.movies.isLoggedIn()
})

test('Deve cadastrar um novo filme', async ({ play }) => {
    const movie = data.create

    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await play.movies.create(movie)
    await play.toast.containText('Cadastro realizado com sucesso!')
})