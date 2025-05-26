import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

export const uploader = (fileAccepted: string[]) => {
    const storage = multer.memoryStorage();

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (!fileAccepted.includes(file.mimetype))
            return cb(new Error('File format not supported'));
        cb(null, true);
    }

    return multer({
        storage,
        fileFilter,
        limits: {fileSize: 2 * 1024 * 1024}
    })
}