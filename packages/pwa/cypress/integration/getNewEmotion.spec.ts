context('Get New Emotion on the Home Page', () => {
    before(() => {
        cy.wipeDatabase()
    })

    it('should get a new emotion badge and load it after clicking on the badge', () => {
        cy.visit('/')
        cy.signUpTestUser()
        cy.intercept('/').as('homeWithCredential')
        cy.wait('@homeWithCredential')

        cy.insertTonsOfEmotions(1)
        cy.get('[alt="👀"]').parent().click()
        cy.get('.infinite-scroll-component > :first-child').should('exist')
    })
})
