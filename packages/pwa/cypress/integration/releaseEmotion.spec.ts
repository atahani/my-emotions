context('Release an Emotion', () => {
    before(() => {
        cy.wipeDatabase()
        cy.visit('/')
        cy.signUpTestUser()
    })

    beforeEach(() => {
        cy.restoreLocalStorageCache()
        Cypress.Cookies.preserveOnce('access-token', 'app-id')
    })

    afterEach(() => {
        cy.saveLocalStorageCache()
    })

    it('should navigate to `/release-emotion` path while clicking on the 🆕 button', () => {
        cy.get('[alt="🆕"]').click()
        cy.location('pathname').should('to.eq', '/release-emotion')
    })

    it('should be able to release a new emotion', () => {
        const emotionText = 'I love writing e2e tests by Cypress.'

        cy.get('[type="search"]').type('test')
        cy.get('[aria-label="Search Results"] > .emoji-mart-category-list > :nth-child(1) > .emoji-mart-emoji').click()
        cy.get('[alt="▶️"]').click()

        cy.contains(`Unreleased Emotion`).should('exist')
        cy.get('[alt="🧪"]').should('have.length', 2)
        cy.get('textarea').type(emotionText)
        cy.get('[alt="✔️"]').click()

        cy.location('pathname').should('to.eq', '/')
        cy.contains(emotionText).should('exist')
    })
})
