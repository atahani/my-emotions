context('Logging Into Application', () => {
    before(() => {
        cy.wipeDatabase()
        cy.clearLocalStorage()
    })

    beforeEach(() => {
        cy.restoreLocalStorageCache()
        Cypress.Cookies.preserveOnce('access-token', 'app-id')
    })

    afterEach(() => {
        cy.saveLocalStorageCache()
    })

    it('should navigate login page by clicking on the login button', () => {
        cy.visit('/')
        cy.get('[alt="👣"]').click()
        cy.location('pathname').should('eq', '/login')
    })

    it('should handle login/callback in the good way and login into the application', () => {
        cy.visit('/')
        // since we are using google authentication we mock login by testing helper endpoint
        cy.signUpTestUser()
        cy.getCookies().should('have.length', 2)

        cy.location('pathname').should('eq', '/')
        cy.window().then((win) => {
            expect(win.localStorage.getItem('is_logged_in')).to.be.eq('true')
            expect(win.localStorage.getItem('user_profile')).to.be.not.undefined
        })
        expect(cy.get('[alt="🆕"]')).to.exist
    })

    it('should navigate to profile page click on logout button and clear the local storage', () => {
        const data = localStorage.getItem('user_profile') || ``
        const profile = JSON.parse(data)
        cy.visit(`/users/${profile.id}`)

        cy.get('[alt="🏃🏻"]').click()

        cy.location('pathname').should('eq', '/')

        cy.window().then((win) => {
            expect(win.localStorage.getItem('is_logged_in')).to.be.null
            expect(win.localStorage.getItem('user_profile')).to.be.null
        })
    })
})
