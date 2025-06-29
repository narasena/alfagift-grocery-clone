import * as Yup from 'yup';

export const addressValidationSchema = Yup.object().shape({
      address: Yup.string().required(),
      city: Yup.string().required(),
      province: Yup.string().required(),
      postalCode: Yup.string().required(),
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
})