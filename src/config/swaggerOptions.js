// swaggerOptions.js
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Del Proyecto",
      version: "1.0.0",
      description: "API para la documentacion del proyecto",
    },
  },
  apis: [path.join(__dirname, '../docs/**/*.yaml')], 
};

//console.log(options)

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;