import { type } from "os";

describe('Inicio sesión Emprendedor', () => {
  it('SS-001: Iniciar sesión correctamente', () => {
    
    cy.visit('http://localhost:3001/login-emprendedor')

    cy.get('input[name="correo"]')
      .type('matiasnmv20@gmail.com')
      .should('have.value', 'matiasnmv20@gmail.com');

    cy.get('input[name="contrasena"]')
      .type('alergico2024')
      .should('have.value', 'alergico2024');

    cy.get('button.login-emprendedor-button')
      .click();

    cy.url().should('eq', 'http://localhost:3001/');

    cy.wait(3000);

  });

  it('SS-002: Error al iniciar sesión', () => {
    cy.visit('http://localhost:3001/login-emprendedor')

    cy.get('input[name="correo"]')
      .type('matiasnmv21@gmail.com')
      .should('have.value', 'matiasnmv21@gmail.com');

    cy.get('input[name="contrasena"]')
      .type('alergico2025')
      .should('have.value', 'alergico2025');

    cy.get('button.login-emprendedor-button')
      .click();

    cy.wait(3000);

  });

  it('SS-003: Cerrar sesión', () => {

    cy.visit('http://localhost:3001/login-emprendedor')

    cy.get('input[name="correo"]')
      .type('matiasnmv20@gmail.com')
      .should('have.value', 'matiasnmv20@gmail.com');

    cy.get('input[name="contrasena"]')
      .type('alergico2024')
      .should('have.value', 'alergico2024');
      

    cy.get('button.login-emprendedor-button')
    .click();

    cy.url().should('eq', 'http://localhost:3001/');

    cy.wait(5000);

    cy.get('.btn-logout', { timeout: 3000 }).should('be.visible').click();

    cy.url().should('include', 'http://localhost:3001/')

  });

  it('SS-004: ¿Olvido la contraseña?', () => {
    cy.visit('http://localhost:3001/login-emprendedor')

    cy.get('button.login-emprendedor-recuperar-button').click();

    //cy.get('.login-emprendedor-modal', { timeout: 5000 }).should('be.visible');

    cy.get('input[type="email"]')
      .type('matiasnmv20@gmail.com')
      .should('have.value', 'matiasnmv20@gmail.com');

    cy.wait(3000);

    cy.get('button.login-emprendedor-enviar-button')
      .click();

    cy.wait(3000);

    //cy.get('button.login-emprendedor-cancelar-button').click();

    //cy.get('.login-emprendedor-modal').should('not.be.visible');
  });
});
