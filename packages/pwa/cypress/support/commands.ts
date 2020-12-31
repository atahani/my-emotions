// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // tslint:disable-next-line interface-name
    interface Chainable {
        saveLocalStorageCache: () => void
        restoreLocalStorageCache: () => void
        clearLocalStorageCache: () => void
        wipeDatabase: () => Chainable<Cypress.Response>
        signUpTestUser: (firstName?: string, lastName?: string, email?: string) => Chainable
        insertTonsOfEmotions: (count: number) => Chainable<Cypress.Response>
    }
}

let LOCAL_STORAGE_MEMORY: Record<string, any> = {}

Cypress.Commands.add('saveLocalStorageCache', () => {
    Object.keys(localStorage).forEach((key) => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })
})

Cypress.Commands.add('restoreLocalStorageCache', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
    })
})

Cypress.Commands.add('clearLocalStorageCache', () => {
    localStorage.clear()
    LOCAL_STORAGE_MEMORY = {}
})

Cypress.Commands.add('wipeDatabase', () => {
    return cy.request('POST', `${Cypress.env('TESTING_HELPER_API')}/db/wipe`)
})

Cypress.Commands.add('signUpTestUser', (firstName = 'firstName', lastName = 'lastName', email = 'mail@mail.com') => {
    cy.request('POST', `${Cypress.env('TESTING_HELPER_API')}/user/signup`, {
        firstName,
        lastName,
        email,
    })
    return cy.visit('/login/callback')
})

Cypress.Commands.add('insertTonsOfEmotions', (count: number) => {
    return cy.request('POST', `${Cypress.env('TESTING_HELPER_API')}/emotions/insert/bulk?count=${count}`)
})
