context('Home Page', () => {
    before(() => {
        cy.wipeDatabase()
        cy.signUpTestUser()
        cy.insertTonsOfEmotions(42)
    })

    beforeEach(() => {
        cy.visit('/')
    })

    it(`should load 20 emotions by at first step since the default items per page is 20`, () => {
        cy.get('.infinite-scroll-component').children().should('have.length', 20)
    })

    it(`should load all of the 40 emotions by scrolling into the next page`, () => {
        cy.get('.infinite-scroll-component > :last-child').scrollIntoView()
        cy.get('.infinite-scroll-component').children().should('have.length', 40)
    })
})
