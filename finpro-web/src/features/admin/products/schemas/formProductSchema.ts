import * as Yup from 'yup';

export const formProductSchema = Yup.object({
    name: Yup.string().required('Required'),
    price: Yup.number().required('Required').positive('Price must be a positive number'),
    productSubCategoryId: Yup.string().required('Required'),
    brandId: Yup.string().optional(),
    description: Yup.string().optional(),
    sku: Yup.string().optional(),
    barcode: Yup.string().optional(),
    weight: Yup.number().optional(),
    dimensions: Yup.string().optional()
});