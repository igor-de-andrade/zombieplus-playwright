import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

import { Leads } from '../actions/Leads';
import { Toast } from '../actions/Components';

let leads: Leads
let toast: Toast

test.beforeEach(async ({ page }) => {
  leads = new Leads(page)
  toast = new Toast(page)
})

test('Deve cadastrar um novo lead com sucesso', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await leads.visit()
  await leads.openLeadModal()
  await leads.submitLeadForm(leadName, leadEmail)

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

  await leads.visit()
  await leads.openLeadModal()
  await leads.submitLeadForm(leadName, leadEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await toast.containText(message)
})

test('Não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await leads.visit()
  await leads.openLeadModal()
  await leads.submitLeadForm('', 'user@email.com')

  await leads.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await leads.visit()
  await leads.openLeadModal()
  await leads.submitLeadForm('User', '')

  await leads.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando o email é inválido', async ({ page }) => {
  await leads.visit()
  await leads.openLeadModal()
  await leads.submitLeadForm('User', 'user@emailcom')

  await leads.alertHaveText('Email incorreto')
})

test('Não deve cadastrar com nenhum campo preenchido', async ({ page }) => {
  await leads.visit()
  await leads.openLeadModal()
  await leads.submitLeadForm('', '')

  await leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})