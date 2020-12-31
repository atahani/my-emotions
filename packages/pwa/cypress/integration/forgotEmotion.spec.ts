context('Forgot An Emotion', () => {
    before(() => {
        cy.wipeDatabase()
    })

    it('should remove an emotion by clicking on the 🙅‍♂️ button', () => {
        cy.visit('/')
        cy.signUpTestUser()
        cy.insertTonsOfEmotions(1)
        cy.get('.infinite-scroll-component').children().should('have.length', 1)

        cy.get('[alt="🙅‍♂️"]').click()
        cy.get('.infinite-scroll-component').children().should('have.length', 0)
        cy.contains(`Be sure; I've forgotten this emotion.`).should('exist')
    })
})
