context('Profile Page', () => {
    before(() => {
        cy.wipeDatabase()
    })

    it('should navigate to the user profile by clicking on the user display name', () => {
        cy.visit('/')
        cy.signUpTestUser()
        cy.insertTonsOfEmotions(15)

        cy.contains('firstName lastName').click()

        cy.get('.infinite-scroll-component').children().should('have.length', 15)
        cy.get('[alt="🏃🏻"]').should('exist')

        cy.window().then((win) => {
            const profile = JSON.parse(win.localStorage.getItem('user_profile') || ``)
            expect(win.location.pathname).to.eq(`/users/${profile.id}`)
        })
    })
})
