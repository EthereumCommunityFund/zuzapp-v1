import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'app.log');



export function logToFile(error_type: string, error_message: string, error_code: number | string, user: string | undefined): void {

    const date = new Date().toISOString();
    const logMessage = `[${date}]\n user: ${user}\n error_type: ${error_type}\n error_message: ${error_message} \n error_code: ${error_code}\n\n `;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}
