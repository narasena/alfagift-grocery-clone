"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const uploader = (fileAccepted) => {
    const storage = multer_1.default.memoryStorage();
    const fileFilter = (req, file, cb) => {
        if (!fileAccepted.includes(file.mimetype))
            return cb(new Error('File format not supported'));
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: 2 * 1024 * 1024 }
    });
};
exports.uploader = uploader;
