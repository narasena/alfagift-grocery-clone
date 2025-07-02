"use client";

import AdminAddDiscountForm from "@/features/admin/discounts/add/components/AdminAddDiscountForm";
import { useAdminAddDiscounts } from "@/features/admin/discounts/add/hooks/useAdminAddDiscounts";
import addDiscountSchema from "@/features/admin/discounts/add/schemas/addDiscountsSchema";
import { Formik } from "formik";
import * as React from "react";
import * as Yup from "yup";

export default function AdminAddDiscountPage() {
  const { addDiscountInitialValues, handleCreateDiscount } = useAdminAddDiscounts();

  return (
    <Formik
      initialValues={addDiscountInitialValues}
      validationSchema={addDiscountSchema}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Form Values:", values);
        console.log("Is Valid:", addDiscountSchema.isValidSync(values));
        try {
          addDiscountSchema.validateSync(values, { abortEarly: false });
          console.log("Validation passed!");
          handleCreateDiscount(values);
          setSubmitting(false);
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            console.log("Validation Errors:", err.errors);
          }
          setSubmitting(false);
        }
      }}
      className="bg-white"
    >
      {({ values, setFieldValue }) => {
        return <AdminAddDiscountForm values={values} setFieldValue={setFieldValue} />;
      }}
    </Formik>
  );
}
