import { body } from "express-validator"

export const registerUserValidator = [
    body(['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'gender', 'dateOfBirth', 'address', 'subDistrict', 'district', 'city', 'province', 'postalCode', 'latitude', 'longitude', 'isMainAddress']).notEmpty().withMessage('Data tidak boleh kosong'),
    body('email').isEmail().withMessage('Alamat email invalid'),
    body('phoneNumber').isMobilePhone('any').withMessage('Nomor handphone invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
]