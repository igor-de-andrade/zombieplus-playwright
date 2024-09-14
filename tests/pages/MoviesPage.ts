import { Page, expect } from '@playwright/test';

export class MoviesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async isLoggedIn() {
        await this.page.waitForLoadState('networkidle')
        //await expect(this.page).toHaveURL('http://localhost:3000/admin/movies')
        await expect(this.page).toHaveURL(/.*admin/)
        await expect(this.page.locator('a[href="/logout"]')).toBeVisible()
    }

    async create(movie) {
        await this.page.locator('a[href$="/register"]').click()
        await this.page.getByLabel('Titulo do filme').fill(movie.title)
        await this.page.getByLabel('Sinopse').fill(movie.overview)

        await this.page.locator('#select_company_id .react-select__indicator')
            .click()
        await this.page.locator('.react-select__option')
            .filter({hasText: movie.company})
            .click()

        await this.page.locator('#select_year .react-select__indicator')
            .click()
        await this.page.locator('.react-select__option')
            .filter({hasText: movie.release_year})
            .click()  

        await this.page.getByRole('button', {name: 'Cadastrar'}).click()
    }

}