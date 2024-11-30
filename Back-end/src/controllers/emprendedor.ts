import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response } from "express";
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { Emprendedor } from "../models/emprendedor";
import { Productos } from '../models/producto';
import { deleteFileFromDrive, setPublicAccessToFile, uploadFileToDrive } from '../services/googleDrive';
import { sendEmail } from '../services/mail';
import { MulterRequest } from '../services/types';

export const getEmprendedores: RequestHandler = async(req: MulterRequest, res: Response): Promise<void> => {
    try{
        const listEmprendedores = await Emprendedor.findAll({
            attributes: [
                'id_emprendedor',
                'rut_emprendedor',
                'contrasena',
                'nombre_emprendedor',
                'apellido1_emprendedor',
                'apellido2_emprendedor',
                'direccion',
                'telefono',
                'correo_electronico',
                'imagen_productos',
                'imagen_local',
                'comprobante',
                'tipo_de_cuenta',
                'numero_de_cuenta',
                'estado_emprendedor',
            ]
        });
        res.json(listEmprendedores);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los emprendedores'})
    }
}

export const crearEmprendedor : RequestHandler = async (req: MulterRequest, res: Response): Promise<void> => {

    try {
        const { rut_emprendedor, contrasena, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor, direccion, telefono, correo_electronico, tipo_de_cuenta, numero_de_cuenta} = req.body;

        const emprendedor = await Emprendedor.findOne({ where: {rut_emprendedor: rut_emprendedor}})
        const emprededorCorreo = await Emprendedor.findOne({ where: {correo_electronico: correo_electronico}});

        if (emprendedor) {
            res.status(400).json({
                msg: 'Ya existe un emprendedor con ese rut'
            });
            return;
        }

        if (emprededorCorreo) {
            res.status(400).json({
                msg: 'El correo utilizado ya ha sido utilizado'
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const files = req.files as { [fieldname: string] : Express.Multer.File[] };

        if (!files?.['comprobante'] || !files?.['imagen_local'] || !files?.['imagen_productos']) {
            res.status(400).json({message: 'Faltan archivos'});
            return;
        }

        const subirArchivos = async (archivos: Express.Multer.File[], tipoMime: string): Promise<string[]> => {
            const fileIds: string[] = [];
            for (const archivo of archivos) {
                const filePath = path.join(__dirname, '../uploads', archivo.filename ?? 'archivo_default');
                const fileName = archivo.originalname ?? 'archivo_default';
                const fileId = await uploadFileToDrive(filePath, fileName, tipoMime);
                fs.unlinkSync(filePath); 
                
                if (!fileId) {
                    throw new Error(`Error al subir el archivo: ${fileName}`)
                }
                fileIds.push(fileId);
            }
            return fileIds;
        };

        const comprobanteFileIds = await subirArchivos(files['comprobante'], 'aplication/pdf');
        const imagenLocalFileIds = await subirArchivos(files['imagen_local'], 'image/png');
        const imagenProductosFileIds = await subirArchivos(files['imagen_productos'], 'image/png');

        const nuevoEmprendedor = await Emprendedor.create({
            "rut_emprendedor": rut_emprendedor,
            "contrasena": hashedPassword,
            "nombre_emprendedor": nombre_emprendedor,
            "apellido1_emprendedor": apellido1_emprendedor,
            "apellido2_emprendedor": apellido2_emprendedor,
            "direccion": direccion,
            "telefono": telefono,
            "correo_electronico": correo_electronico,
            "imagen_productos": imagenProductosFileIds.join(','),
            "imagen_local": imagenLocalFileIds.join(','),
            "comprobante": comprobanteFileIds.join(','),
            "tipo_de_cuenta": tipo_de_cuenta,
            "numero_de_cuenta": numero_de_cuenta,
            "estado_emprendedor": 'Pendiente',
        })
        res.status(201).json({
            message: 'Emprendedor creado exitosamente',
            emprendedor: nuevoEmprendedor,
        });
    } catch (error) {
        console.error('Error al crear el emprendedor:', (error as Error).message);
         res.status(500).json({
          message: 'Error al crear el emprendedor',
          error: (error as Error).message || 'Error desconocido',
        })
    }
}

export const getEmprendedor: RequestHandler = async(req, res) => {
    const {rut_emprendedor} = req.params;
    try {
        const emprendedor = await Emprendedor.findOne({
            attributes: [
                'id_emprendedor',
                'rut_emprendedor',
                'contrasena',
                'nombre_emprendedor',
                'apellido1_emprendedor',
                'apellido2_emprendedor',
                'direccion',
                'telefono',
                'correo_electronico',
                'imagen_productos',
                'imagen_local',
                'comprobante',
                'tipo_de_cuenta',
                'numero_de_cuenta',
                'estado_emprendedor',
            ], where: {rut_emprendedor: rut_emprendedor}
        }); 
        if (!emprendedor) {
            return res.status(404).json({msg: 'El rut de este emprendedor no existe'})
        }

        const obtenerIdPublicas = async (fileIds: string | null): Promise<string[] | null> => {
            if (!fileIds) return null;
            const ids = fileIds.split(',');
            const urls = await Promise.all(
                ids.map(async (id) => {
                    try {
                        return await setPublicAccessToFile(id);
                    } catch (error) {
                        console.error(`Error al obtener URL pública para el archivo ${id}:`, error)
                        return null;
                    }
                })
            );
            return urls.filter((url) => url !== null);
        }

        const comprobanteFileIds = await obtenerIdPublicas(emprendedor.getDataValue('comprobante'));
        const imagenProductosIds = await obtenerIdPublicas(emprendedor.getDataValue('imagen_productos'));
        const imagenLocalIds = await obtenerIdPublicas(emprendedor.getDataValue('imagen_local'));

        // Responder con los datos del emprendedor y los enlaces públicos
        res.json({
            ...emprendedor.toJSON(),
                comprobante: comprobanteFileIds,
                imagen_productos: imagenProductosIds,
                imagen_local: imagenLocalIds,
        });
    
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error',
            error
        })
    }
}

export const loginEmprendedor = async(req: Request, res: Response) => {
    const { correo_electronico, contrasena} = req.body;
    try {
        const emprendedor = await Emprendedor.findOne({where: {correo_electronico: correo_electronico}});

        if (!emprendedor) {
            return res.status(401).json({
                msg: 'El correo ingresado no es valido'
            })
        }

        if (emprendedor.dataValues.estado_emprendedor !== 'Aprobado') {
            return res.status(403).json({
                msg: 'Usuario no registrado'
            })
        }

        const emprendedorPassword = await bcrypt.compare(contrasena, emprendedor.dataValues.contrasena);
        if (!emprendedorPassword) {
            return res.status(401).json({
                msg: 'Contraseña Incorrecta'
            })
        }

        const rol = 'emprendedor';
        const id_emprendedor = emprendedor.dataValues.id_emprendedor;
        const token = jwt.sign({
            correo: correo_electronico,
            role: rol,
            id_emprendedor: id_emprendedor
        }, process.env.SECRET_KEY || 'ACCESS',
            { expiresIn: '1h'}
        );

        res.json({ token, rol: rol, id_emprendedor: id_emprendedor})
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({
            msg: 'Ocurrió un error al intentar iniciar sesión. Por favor, intenta de nuevo.',
        });
    }

    
}

export const updatePassword = async(req: Request, res: Response) => {

    const {rut_emprendedor, contrasena} = req.body;

    console.log('RUT recibido:', rut_emprendedor);
    console.log('Contraseña recibida:', contrasena);

    if (!rut_emprendedor) {
        return res.status(400).json({
            msg: 'Por favor, ingrese un Rut valido',
        });
    }

    if (!contrasena) {
        return res.status(400).json({
            msg: 'Por favor, ingrese una nueva contraseña',
        });
    }

    try {
        const emprendedor = await Emprendedor.findOne({where: {rut_emprendedor: rut_emprendedor}});

        if (!emprendedor) {
            return res.status(404).json({
                msg: 'Emprendedor no encontrado',
            });
        }

        const antigua_contraseña = emprendedor.getDataValue('contrasena');
        const compara_contrasenas = await bcrypt.compare(contrasena, antigua_contraseña);

        if (compara_contrasenas) {
            return res.status(400).json({
                msg: 'La nueva contraseña no puede ser igual al anterior',
            });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        await Emprendedor.update(
            { contrasena: hashedPassword},
            { where: {rut_emprendedor: rut_emprendedor} }
        );

        return res.status(200).json({
            msg: 'Contraseña actualizada correctamente',
        })
    } catch (error) {
        console.error('Error al actualizar la contraseña', error);
        return res.status(500).json({
            msg: 'Error actualizando la contraseña. Intentelo mas tarde',
        })
    }
}

export const updateEmprendedor = async(req: Request, res: Response) => {
    const {rut_emprendedor} = req.params;

    const {
        contrasena,
        nombre_emprendedor,
        apellido1_emprendedor,
        apellido2_emprendedor,
        direccion,
        telefono,
        correo_electronico,
        tipo_de_cuenta,
        numero_de_cuenta,
    } = req.body;

    try {
        const rutEmprendedor = await Emprendedor.findOne({where: {rut_emprendedor: rut_emprendedor}});

        if (!rutEmprendedor) {
            return res.status(404).json({
                msg: 'El rut '+rut_emprendedor+ 'de este emprendedor no existe'
            })
        }

        if (contrasena) {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            await Emprendedor.update({
                "contrasena": hashedPassword,
                "nombre_emprendedor": nombre_emprendedor,
                "apellido1_emprendedor": apellido1_emprendedor,
                "apellido2_emprendedor": apellido2_emprendedor,
                "direccion": direccion,
                "telefono": telefono,
                "correo_electronico": correo_electronico,
                "tipo_de_cuenta": tipo_de_cuenta,
                "numero_de_cuenta": numero_de_cuenta,
            }, { where: {rut_emprendedor: rut_emprendedor}});

            
            return res.json({msg: 'Se ha actualizado el emprendedor con rut: ', rut_emprendedor});
          } else {
            await Emprendedor.update({
                "nombre_emprendedor": nombre_emprendedor,
                "apellido1_emprendedor": apellido1_emprendedor,
                "apellido2_emprendedor": apellido2_emprendedor,
                "direccion": direccion,
                "telefono": telefono,
                "correo_electronico": correo_electronico,
                "tipo_de_cuenta": tipo_de_cuenta,
                "numero_de_cuenta": numero_de_cuenta,
            }, { where: {rut_emprendedor: rut_emprendedor}});

            
            return res.json({msg: 'Se ha actualizado el emprendedor con rut: ', rut_emprendedor});
          }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al actualizar el emprendedor'});
    }
}

export const deleteEmprendedor = async(req: Request, res: Response) => {
    const {rut_emprendedor} = req.params;

    try {
        const emprendedor = await Emprendedor.findOne({where: {rut_emprendedor: rut_emprendedor}});
        if (!emprendedor) {
            return res.status(404).json({msg: 'Emprendedor no encontrado'});
        }

        const productos = await Productos.findAll({ where: { id_emprendedor: emprendedor.dataValues.id_emprendedor}});

        for (const producto of productos) {
            const imagenProductosId = producto.getDataValue('imagen');
            if (imagenProductosId) {
                try {
                    await deleteFileFromDrive(imagenProductosId);
                    console.log(`Ìmagen de producto con ID ${imagenProductosId} eliminada correctamente`);
                } catch (error) {
                    console.error(`Error al eliminar la imagen del producto con ID ${imagenProductosId}`, error);
                }
            }

            try {
                await producto.destroy();
                console.log(`Producto con ID ${producto.dataValues.cod_producto} eliminado correctamente`);
            } catch (error) {
                console.error(`Error al eliminar el producto con ID ${producto.dataValues.cod_producto}:`, error);
            }
        }

        const archivos = [
            emprendedor.getDataValue('comprobante'),
            emprendedor.getDataValue('imagen_local'),
            emprendedor.getDataValue('imagen_productos'),
        ]

        for (const fileId of archivos) {
            if (fileId) {
                const ids = fileId.split(',');
                for (const id of ids) {
                    try {
                        await deleteFileFromDrive(id.trim()); 
                        console.log(`Archivo con ID ${id} eliminado`);
                    } catch (error) {
                        console.error(`Error al eliminar archivo con ID ${id}: `, error);
                    }
                }
            }
        }

        await emprendedor.destroy();

        return res.json({ msg: 'Emprendedor, sus productos y sus archivos eliminados correctamente'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error eliminando al emprendedor'});
    }
}

export const updateEstadoEmprendedor = async (req: Request, res: Response) => {
    const { rut_emprendedor, nuevoEstado} = req.body;

    try {
        const emprendedor = await Emprendedor.findOne({ where: { rut_emprendedor}});

        if (!emprendedor) {
            return res.status(404).json({
                msg: 'Emprendedor no encontrado'
            });
        }

        const estadoActual = emprendedor.getDataValue('estado_emprendedor');
        if (estadoActual !== 'Pendiente') {
            return res.status(400).json({
                msg: 'El emprendedor no esta en estado pendiente',
            });
        }

        if (nuevoEstado === 'Aprobado') {

            await sendEmail(
                emprendedor.getDataValue('correo_electronico'),
                'Cuenta Aprobada',
                `Hola ${emprendedor.getDataValue('nombre_emprendedor')}.
                Tu cuenta ha sido aprobada exitosamente.
                ¡Bienvenido a Emprende Maule!`);

            await emprendedor.update({ estado_emprendedor: nuevoEstado});

            return res.status(200).json({
                msg: 'Estado actualizado a Aprovado y correo enviado',
            });
        }

        if (nuevoEstado == 'Rechazado') {
            const archivos = [
                emprendedor.getDataValue('comprobante'),
                emprendedor.getDataValue('imagen_local'),
                emprendedor.getDataValue('imagen_productos'),
            ];

            for (let fileId of archivos) {
                if (fileId) {
                    const ids = fileId.split(',');
                    for (let id of ids) {
                        try {
                            await deleteFileFromDrive(id.trim()); 
                            console.log(`Archivo con ID ${id} eliminado`);
                        } catch (error) {
                            console.error(`Error al eliminar archivo con ID ${id}: `, error);
                        }
                    }
                }
            }

            await sendEmail(
                emprendedor.getDataValue('correo_electronico'),
                'Cuenta Rechazada',
                `Hola ${emprendedor.getDataValue('nombre_emprendedor')},
                Lamentamos informarte que tu cuenta fue rechazada porque no cumplia con los requisitos para el registro`
            );

            await Emprendedor.destroy({ where: {rut_emprendedor}});

            return res.status(200).json({
                msg: 'Estado actualizado a Rechazado, archivos eliminados y correo enviado',
            });
                
        }

        return res.status(400).json({msg: 'Estado no valido'});
    
    } catch (error) {
        console.error('Error al acualizar el estado del emprendedor: ', error);
        return res.status(500).json({
            msg: 'Error al actualizar el estado. Inténtalo más tarde.',
        })
    }

        
}

export const recuperarContrasenaEmprendedor = async (req: Request, res: Response) => {
    const { correo_electronico } = req.body;

    try {
        const emprendedor = await Emprendedor.findOne({ where: { correo_electronico } });

        if (!emprendedor) {
            return res.status(404).json({ msg: 'No existe un emprendedor con ese correo' });
        }

        const token = jwt.sign({ correo_electronico: emprendedor.getDataValue("correo_electronico"), id_emprendedor: emprendedor.getDataValue("id_emprendedr"), rol: "emprendedor" }, process.env.SECRET_KEY || 'ACCESS', { expiresIn: '1h' });

        const link = `http://localhost:3001/#/reset-password-emprendedor/${token}`;

        await sendEmail(
            correo_electronico,
            'Recuperar contraseña',
            `Haz clic en el siguiente enlace para recuperar tu contraseña: ${link}`
        );

        return res.status(200).json({ msg: 'Se envio un enlace de recuperacion de contraseña a tu correo' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ msg: 'Error al enviar el correo' });
    }
};

export const resetPasswordEmprendedor = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { contrasenaActual, nuevaContrasena } = req.body;

    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'ACCESS');

        const emprendedor = await Emprendedor.findOne({ where: { correo_electronico: decoded.correo_electronico } });

        if (!emprendedor) {
            return res.status(400).json({
                msg: 'No se encontró un emprendedor con ese correo',
            });
        }

        const contrasenaActualValida = await bcrypt.compare(contrasenaActual, emprendedor.getDataValue('contrasena'));

        if (!contrasenaActualValida) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta',
            })
        }

        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        await Emprendedor.update({ contrasena: hashedPassword }, { where: { correo_electronico: decoded.correo_electronico } });

        await sendEmail(
            decoded.correo_electronico,
            'Contraseña restablecida',
            'Tu contraseña ha sido restablecida exitosamente.'
        );

        return res.status(200).json({
            msg: 'Se ha restablecido la contraseña exitosamente',
        });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).json({
            msg: 'Error al restablecer la contraseña. Inténtalo más tarde.',
        });
    }
};

export const getEmprendedoresPorEstado = async (req: Request, res: Response) => {
    const { estado } = req.query;

    if (estado !== 'Pendiente' && estado !== 'Aprobado') {
        return res.status(400).json({
            msg: 'El estado debe ser "Pendiente" o "Aprobado".'
        });
    }

    try {
        const emprendedores = await Emprendedor.findAll({
            where: {
                estado_emprendedor: estado
            }
        });

        if (!emprendedores || emprendedores.length === 0) {
            return res.status(404).json({
                msg: `No se encontraron emprendedores con estado ${estado}.`
            });
        }

        return res.status(200).json(emprendedores);
    } catch (error) {
        console.error('Error al obtener los emprendedores por estado: ', error);
        return res.status(500).json({
            msg: 'Error al obtener los emprendedores. Inténtalo más tarde.',
        });
    }
};

export const getEmprendedorById: RequestHandler = async(req, res) => {
    const {id_emprendedor} = req.params;
    try {
        const emprendedor = await Emprendedor.findByPk(id_emprendedor); 
        if (!emprendedor) {
            return res.status(404).json({msg: 'El ID de este emprendedor no existe'})
        }

        // Responder con los datos del emprendedor y los enlaces públicos
        res.json({
            emprendedor
        });
    
    } catch (error) {
        res.status(400).json({
            msg: 'Ha ocurrido un error',
            error
        })
    }
}