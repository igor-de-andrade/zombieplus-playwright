import { Page, expect } from '@playwright/test';

export class Login {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000/admin/login')

        const loginForm = this.page.locator('.login-form')
        await expect(loginForm).toBeVisible()
    }

    async submitLogin(email: string, password: string) {
        await this.page.getByPlaceholder("E-mail").fill(email)
        await this.page.getByPlaceholder("Senha").fill(password)
        await this.page.getByText('Entrar').click()
    }

    async isLoggedIn(username: string) {
        const loggedUser = this.page.locator('.logged-user')
        await expect(loggedUser).toHaveText(`Olá, ${username}`)
    }

    async alertHaveText(message) {
        await expect(this.page.locator('span[class*="alert"]')).toHaveText(message)
    }
}