import { basename } from '../client';
console.info(`Loading ${basename(__filename)}`);

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('uncaughtException:', error);
});

process.on('uncaughtExceptionMonitor', (error) => {
    console.error('uncaughtExceptionMonitor:', error);
});

export const defaultError = '**Error**';
