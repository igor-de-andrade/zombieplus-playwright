import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

import { LandingPage } from '../pages/LandingPage';
import { Toast } from '../pages/Components';

let landingPage: LandingPage
let toast: Toast

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page)
  toast = new Toast(page)
})

test('Deve cadastrar um novo lead com sucesso', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await toast.containText(message)
})

test('Não deve cadastrar quando o e-mail já existe', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, leadEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await toast.containText(message)
})

test('Não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('', 'user@email.com')

  await landingPage.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('User', '')

  await landingPage.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando o email é inválido', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('User', 'user@emailcom')

  await landingPage.alertHaveText('Email incorreto')
})

test('Não deve cadastrar com nenhum campo preenchido', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('', '')

  await landingPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})