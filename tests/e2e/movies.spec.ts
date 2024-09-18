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
    await play.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('Não deve cadastrar quando os campos obrigatórios não estão preenchidos', async ({ play }) => {
    await play.movies.goForm()
    await play.movies.submit()

    await play.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ])
})

test('Não deve cadastrar quando o título é duplicado', async ({ play, requestPlus }) => {
    const movie = data.duplicate

    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await requestPlus.api.postMovie(movie)

    await play.movies.create(movie)
    await play.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})