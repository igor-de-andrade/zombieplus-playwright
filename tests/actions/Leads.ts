import { Page, expect } from '@playwright/test';

export class Leads {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000')
    }

    async openLeadModal() {
        await this.page.getByRole('button', {name: /Aperte o play/ }).click()
        await expect(this.page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')
    }

    async submitLeadForm(name: string, email: string) {
        await this.page.getByPlaceholder('Informe seu nome').fill(name)
        await this.page.getByPlaceholder('Informe seu email').fill(email)
        await this.page.getByTestId('modal').getByText('Quero entrar na fila!').click()
    }

    async alertHaveText(message) {
        await expect(this.page.locator('.alert')).toHaveText(message)
    }
}