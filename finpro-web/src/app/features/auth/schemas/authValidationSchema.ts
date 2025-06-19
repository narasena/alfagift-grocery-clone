import * as Yup from 'yup';

export const authValidationSchema = Yup.object().shape({
  email: Yup.string().email('Email is not valid').required('Email is required'),
  password: Yup.string().required('Password is required'),
});
