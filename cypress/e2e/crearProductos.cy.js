describe('Crear Productos', () => {
    it ('SS-006: Crear Productos', () => {

        cy.visit('http://localhost:3001/')

        cy.visit('http://localhost:3001/login')

        cy.visit('http://localhost:3001/login-emprendedor')

        cy.get('input[name="correo"]')
        .type('todopaldrive@gmail.com')
        .should('have.value', 'todopaldrive@gmail.com');
  
        cy.get('input[name="contrasena"]')
        .type('pantera')
        .should('have.value', 'pantera');
  
        cy.get('button.login-emprendedor-button')
        .click();
  
        cy.url().should('eq', 'http://localhost:3001/');

        cy.visit('http://localhost:3001/gestionProducto')

        cy.get('#nombre_producto').type('Chaleco para perros galgos');
        cy.get('#precio_producto').type('5000');
        cy.get('#descripcion_producto').type('Chaleco para las temporadas de invierno');
        cy.get('#id_categoria').select('2');
        cy.get('#cantidad_disponible').type('30');

        cy.get('#imagen').attachFile('productoCM.jpg');

        cy.contains('Añadir producto').click();
    });
});