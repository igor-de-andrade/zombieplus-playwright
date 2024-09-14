import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MoviesPage } from '../pages/MoviesPage';
import { Toast } from '../pages/Components';

let loginPage: LoginPage
let moviesPage: MoviesPage
let toast: Toast

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    moviesPage = new MoviesPage(page)
    toast = new Toast(page)
})

test('Deve efetuar login como administrador', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submitLogin('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn()
})

test('Não deve efetuar o login com credenciais inválidas', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submitLogin('administrador@zombieplus.com', 'pcd123')

    const message = "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."
    await toast.containText(message)
})

test('Não deve efetuar o login com o e-mail não preenchido', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submitLogin('', 'pcd123')
    await loginPage.alertHaveText('Campo obrigatório')
})

test('Não deve efetuar o login com o e-mail inválido', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submitLogin('administrador@zombiepluscom', 'pcd123')
    await loginPage.alertHaveText('Email incorreto')
})

test('Não deve efetuar o login com a senha não preenchida', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submitLogin('administrador@zombieplus.com', '')
    await loginPage.alertHaveText('Campo obrigatório')
})

test('Não deve efetuar o login com os campos não preenchidos', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submitLogin('', '')
    await loginPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})