import * as Yup from "yup";

export const storeValidationSchema = Yup.object({
  name: Yup.string().required("Nama toko wajib diisi"),
  address: Yup.string().required("Alamat wajib diisi"),
  subDistrict: Yup.string().required("Kelurahan/Desa wajib diisi"),
  district: Yup.string().required("Kecamatan wajib diisi"),
  city: Yup.string().required("Kota/Kabupaten wajib diisi"),
  province: Yup.string().required("Provinsi wajib diisi"),
  postalCode: Yup.string()
    .matches(/^\d{5}$/, "Kode pos harus 5 digit")
    .required("Kode pos wajib diisi"),
latitude: Yup.string()
  .matches(/^-?\d+(\.\d+)?$/, 'Latitude must be a valid number'),
longitude: Yup.string()
  .matches(/^-?\d+(\.\d+)?$/, 'Longitude must be a valid number'),
  phoneNumber: Yup.string()
    .nullable()
    .matches(/^(\+62|08)[0-9]{9,13}$/, {
      excludeEmptyString: true,
      message: "Nomor handphone tidak valid",
    }),
  email: Yup.string()
    .nullable()
    .email("Format email tidak valid"),
});
