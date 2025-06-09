import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Nama depan wajib diisi"),
  lastName: Yup.string().required("Nama belakang wajib diisi"),
  email: Yup.string()
    .email("Format email salah")
    .required("Email wajib diisi"),
  phone: Yup.string().required("Nomor handphone wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  gender: Yup.string().required("Gender wajib dipilih"),
  birthDate: Yup.date().required("Tanggal lahir wajib diisi"),
  address: Yup.string().when("showAddressForm", {
    is: true,
    then: (schema) => schema.required("Alamat lengkap wajib diisi"),
  }),
  isMainAddress: Yup.boolean(),
});
