import 'dotenv/config';
import * as joi from 'joi';

const envsSchema = joi.object({
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  PORT: joi.number().required(),
}).unknown();

const { error, value: envVars } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs = {
  db: {
    host: envVars.DB_HOST,
    port: +envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
  },
  port: +envVars.PORT || 3001,
};
