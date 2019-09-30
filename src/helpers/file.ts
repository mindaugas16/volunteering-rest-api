import * as fs from 'fs';
import * as path from 'path';

export const clearImage = fileName => {
    const filePath = path.join(__dirname, '..', 'assets', 'images', fileName);
    fs.unlink(filePath, error => {
        console.log(error);
    });
};
