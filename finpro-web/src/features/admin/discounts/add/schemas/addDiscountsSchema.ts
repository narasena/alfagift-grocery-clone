import { EDiscountValueType } from "@/types/discounts/discount.type";
import * as Yup from "yup";

const addDiscountSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
  discountType: Yup.string()
    .required("Discount type is required")
    .oneOf(Object.values(EDiscountValueType), "Invalid discount type"),
  discountValue: Yup.number()
    .nullable()
    .transform((val, orig) => (orig === "" ? null : val))
    .when(["discountType", "isGlobalProduct"], {
      is: (discountType: string, isGlobalProduct: boolean) =>
        ["PERCENTAGE", "FIXED_AMOUNT"].includes(discountType) && isGlobalProduct,
      then: (schema) => schema.required("Discount value is required").positive("Must be positive"),
      otherwise: (schema) => schema.strip(),
    }),
  minPurchaseValue: Yup.number()
    .nullable()
    .transform((val, origin) => (origin === "" ? null : val))
    .when("discountType", {
      is: "MIN_PURCHASE",
      then: (schema) =>
        schema.required("Minimum purchase value is required").min(50000, "Minimum purchase must be at least 50,000"),
      otherwise: (schema) => schema.strip(),
    }),

  startDate: Yup.date().required("Start date is required").typeError("Start date must be a valid date"),
  endDate: Yup.date()
    .required("End date is required")
    .typeError("End date must be a valid date")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  isGlobalProduct: Yup.boolean().optional(),
  isGlobalStore: Yup.boolean().optional(),
  usageLimitPerTransaction: Yup.number().optional().positive(),
  selectedStores: Yup.array().when(["isGlobalStore"], {
    is: false,
    then: (schema) => schema.min(1, "Select at least one store").required(),
    otherwise: (schema) => schema.optional(),
  }),
  selectedProducts: Yup.array().when(["discountType", "isGlobalProduct"], {
    is: (discountType: string, isGlobalProduct: boolean) => discountType !== "MIN_PURCHASE" && !isGlobalProduct,
    then: (schema) => schema.min(1, "Select at least one product").required(),
    otherwise: (schema) => schema.optional(),
  }),
  productDiscounts: Yup.array().when(["discountType", "isGlobalProduct"], {
    is: (discountType: string, isGlobalProduct: boolean) =>
      ["PERCENTAGE", "FIXED_AMOUNT"].includes(discountType) && !isGlobalProduct,
    then: (schema) =>
      schema.min(1, "Add at least one product discount group").of(
        Yup.object().shape({
          discountValue: Yup.number().required("Discount value is required").positive("Must be positive"),
          productIds: Yup.array().min(1, "Select at least one product").required(),
        })
      ),
    otherwise: (schema) => schema.optional(),
  }),
});

export default addDiscountSchema;
