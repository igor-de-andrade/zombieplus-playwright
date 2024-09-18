import { Page, expect } from '@playwright/test';

export class Popup {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async haveText(message: string) {
        const element = this.page.locator('.swal2-html-container')

        await expect(element).toHaveText(message)
    }

}