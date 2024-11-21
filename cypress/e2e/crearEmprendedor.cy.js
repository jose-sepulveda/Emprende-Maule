describe('Crear Emprendedor', () => {
    it ('SS-005: Crear Emprendedor', () => {

       cy.visit('http://localhost:3001/')

       cy.wait(2000);

       cy.visit('http://localhost:3001/crearCuenta')

       cy.wait(1000);

       cy.visit('http://localhost:3001/formCrearE')

       cy.get('#nombre_emprendedor').type('Sofia');
       cy.get('#apellido1_emprendedor').type('Silva');
       cy.get('#apellido2_emprendedor').type('Muñoz');
       cy.get('#rut_emprendedor').type('12.345.678-9');
       cy.get('#telefono').type('981247900');
       cy.get('#contrasena').type('popi09');
       cy.get('#correo_electronico').type('mayote219@gmail.com');
       cy.get('#direccion').type('Avenida SiempreViva');
       cy.get('#tipo_de_cuenta').type('Cuenta Corriente');
       cy.get('#numero_de_cuenta').type('1234567890');

       cy.get('#comprobante').attachFile('comprobante.pdf');
       cy.wait(2000);
       cy.get('#imagen_productos').attachFile(['producto1.jpg', 'producto2.jpeg']); 
       cy.wait(2000);
       cy.get('#imagen_local').attachFile(['local1.jpg']);
       cy.wait(2000);

       cy.contains('Registrar').click();
       
       });
});