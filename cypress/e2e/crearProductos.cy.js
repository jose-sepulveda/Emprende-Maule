describe('Crear Productos', () => {
    it ('SS-006: Crear Productos', () => {

        cy.visit('http://localhost:3001/')

        cy.visit('http://localhost:3001/login')

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

        cy.visit('http://localhost:3001/gestionProducto')

        cy.get('#nombre_producto').type('Caballo de mimbre');
        cy.get('#precio_producto').type('3000');
        cy.get('#descripcion_producto').type('Caballo de mimbre para decorar la casa');
        cy.get('#id_categoria').select('3');
        cy.get('#cantidad_disponible').type('30');

        cy.get('#imagen').attachFile('productoCM.jpg');

        cy.contains('Añadir producto').click();
    });
});