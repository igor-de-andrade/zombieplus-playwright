import { test, expect } from '../support/index.js';
import data from '../support/fixtures/movies.json'
import { executeSQL } from '../support/database.js';

test.beforeEach(async ({ play }) => {
    await play.login.visit()
    await play.login.submitLogin('admin@zombieplus.com', 'pwd123')
    await play.login.isLoggedIn('Admin')
})

test('Deve cadastrar um novo filme', async ({ play }) => {
    const movie = data.create

    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await play.movies.create(movie)
    await play.toast.containText('Cadastro realizado com sucesso!')
})

test('Não deve cadastrar quando os campos obrigatórios não estão preenchidos', async ({ play }) => {
    await play.movies.goForm()
    await play.movies.submit()

    await play.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.'
    ])
})

test('Não deve cadastrar quando o título é duplicado', async ({ play, requestPlus }) => {
    const movie = data.duplicate

    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await requestPlus.api.postMovie(movie)

    await play.movies.create(movie)
    await play.toast.containText('Este conteúdo já encontra-se cadastrado no catálogo')
})