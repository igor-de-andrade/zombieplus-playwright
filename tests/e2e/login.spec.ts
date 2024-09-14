import { test, expect } from '@playwright/test';
import { Login } from '../actions/Login';
import { Movies } from '../actions/Movies';
import { Toast } from '../actions/Components';

let login: Login
let movies: Movies
let toast: Toast

test.beforeEach(async ({ page }) => {
    login = new Login(page)
    movies = new Movies(page)
    toast = new Toast(page)
})

test('Deve efetuar login como administrador', async ({ page }) => {
    await login.visit()
    await login.submitLogin('admin@zombieplus.com', 'pwd123')
    await login.isLoggedIn()
})

test('Não deve efetuar o login com credenciais inválidas', async ({ page }) => {
    await login.visit()
    await login.submitLogin('administrador@zombieplus.com', 'pcd123')

    const message = "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."
    await toast.containText(message)
})

test('Não deve efetuar o login com o e-mail não preenchido', async ({ page }) => {
    await login.visit()
    await login.submitLogin('', 'pcd123')
    await login.alertHaveText('Campo obrigatório')
})

test('Não deve efetuar o login com o e-mail inválido', async ({ page }) => {
    await login.visit()
    await login.submitLogin('administrador@zombiepluscom', 'pcd123')
    await login.alertHaveText('Email incorreto')
})

test('Não deve efetuar o login com a senha não preenchida', async ({ page }) => {
    await login.visit()
    await login.submitLogin('administrador@zombieplus.com', '')
    await login.alertHaveText('Campo obrigatório')
})

test('Não deve efetuar o login com os campos não preenchidos', async ({ page }) => {
    await login.visit()
    await login.submitLogin('', '')
    await login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})