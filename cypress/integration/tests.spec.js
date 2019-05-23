describe('app loads and login functionality', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Loads map on page load', () => {
        cy.get('.map-container')
            .should('exist');
    });

    it('Loads login bar on page load', () => {
        cy.get('.nav')
            .should('exist');
    });

    it('Loads data filters on page load', () => {
        cy.get('.data-filters')
            .should('exist');
    });

    it('Loads data legend on page load', () => {
        cy.get('.instructions')
            .should('exist');
    });

    it('Loads active county section on page load', () => {
        cy.get('.active-county')
            .should('exist');
    });

    it('login button loads on page load', () => {
        cy.get('.login-button')
            .first()
            .should('exist')
    });

    it('register button loads on page load', () => {
        cy.get('.login-button')
            .first()
            .next()
            .should('exist')
    });

    it('login click loads email input', () => {
        cy.get('.login-button')
            .first()
            .click()
            .get('.input-box')
            .first()
            .should('exist')
    });

    it('login click loads password input', () => {
        cy.get('.login-button')
            .first()
            .click()
            .get('.text-input')
            .first()
            .next()
            .children()
            .first()
            .should('exist');
    });

    it('login click loads cancel button', () => {
        cy.get('.login-button')
            .first()
            .click()
            .get('.cancel-button')
            .first()
            .should('exist');
    });

    it('cancel click returns login button', () => {
        cy.get('.login-button')
            .first()
            .click()
            .get('.cancel-button')
            .first()
            .click()

            .get('.login-button')
            .first()
            .should('exist');
    });

    it('cancel click returns register button', () => {
        cy.get('.login-button')
            .first()
            .click()
            .get('.cancel-button')
            .first()
            .click()

            .get('.login-button')
            .first()
            .next()
            .should('exist');
    });

    it('email field and password field accept input', () => {
        let email = '2'
        let password = '2'
        cy.get('.login-button')
            .first()
            .click()
            .get('.input-box')
            .first()
            .type(email)

        cy.get('.text-input')
            .first()
            .next()
            .children()
            .first()
            .type(password)
            .type('{enter}');
    });

    it('logging in loads the favorites section', () => {
        let email = '2'
        let password = '2'
        cy.get('.login-button')
            .first()
            .click()
            .get('.input-box')
            .first()
            .type(email)

        cy.get('.text-input')
            .first()
            .next()
            .children()
            .first()
            .type(password)
            .type('{enter}')

        cy.get('.favorites')
            .should('exist');
    });

    it('favorites bar loads favorites cards', () => {
        let email = '2'
        let password = '2'
        cy.get('.login-button')
            .first()
            .click()
            .get('.input-box')
            .first()
            .type(email)

        cy.get('.text-input')
            .first()
            .next()
            .children()
            .first()
            .type(password)
            .type('{enter}')

        cy.get('.favorites')
            .get('.favorites-card')
            .should('exist')
            .should('have.length', 5);
    });
});