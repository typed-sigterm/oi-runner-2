import Consola, { LogLevels } from 'consola/basic';

export const consola = Consola.withTag('OI Runner++');
consola.options.level = process.env.NODE_ENV === 'development' ? LogLevels.debug : LogLevels.info;
