# API REST funcional en entorno local y en producción

## OBJETIVO:

- Proveer datos a un frontend usando una base de datos
- Dar respuestas resolutivas y estandarizadas a todas las peticiones
- Autenticar usuarios
- Gestionar los datos sensibles con seguridad
- Aplicar validaciones a los datos

## QUE OFRECE:

- CRUD de productos
- Registro y login con JWT
- Base de datos MongoDB Atlas
- Validación con Zod
- Rate limiting para autenticación
- Registro de logs
- Y mas

## TECNOLOGÍAS UTILIZADAS

- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript
- Y mas

## INSTALACIÓN (clonar y levantar el proyecto localmente) con bash

- git clone <https://github.com/Cristian-MG00/backend_utn.git>
- cd proyecto
- npm install
- npm run dev

## IMPORTANTE: Este proyecto requiere un archivo `.env` con ciertas variables de entorno para funcionar, las mismas deben contener tus propias credenciales.

- PORT=3000(o el puerto que definas)
- MONGODB_URI=mongodb+srv://...
- JWT_SECRET=tu_secreto
- EMAIL_USER=tuEmail@gmail.com
- EMAIL_PASS=tuPassword

## USO DE LA API

### Ejemplos de endpoints:

- Obtener todos los productos: GET /products
- Obtener un producto: GET /products/:id
- Agregar un producto: POST /products
- Actualizar un producto: PATCH /products/:id
- Obtener prodcutos usando filtros: GET /products?query=valor

## ESTRUCTURA DEL PROYECTO(src: código fuente)

```
src/
├── config/
├── controllers/
├── interfaces/
├── middleware/
├── model/
├── routes/
├── templates/
├── validators/
└── index.ts
```

## COLECCIÓN DE BRUNO (Endpoints)

## Este proyecto incluye una colección lista para usar con Bruno API Client.

Cómo importarla:

- Abrí Bruno
- Hacé clic en Import Collection
- Seleccioná el archivo: /bruno/utn-backend.json
- Y vas a tener todos los endpoints para probar la API.
