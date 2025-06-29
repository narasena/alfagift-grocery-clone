import * as Yup from "yup";

export const registeValidationAdminSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string(),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6).required("Required"),
  phoneNumber: Yup.string().required("Required"),
  storeId: Yup.string().required("Please select a store"),
role: Yup.string().required("Please select a role"),
});