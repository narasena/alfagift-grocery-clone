import { ErrorMessage, Field, FieldProps } from "formik";
import * as React from "react";

interface IAdminInputFieldAsCheckboxProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
}

export default function AdminInputFieldAsCheckbox(props: IAdminInputFieldAsCheckboxProps) {
  return (
    <div className="w-full col-span-2 flex items-center gap-2.5">
      <Field name={props.name}>
        {({ field }: FieldProps) => (
          <>
            <input
              {...field}
              type="checkbox"
              id={props.name}
              className="order-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5"
              defaultChecked={props.defaultChecked}
              onChange={(e) => {
                field.onChange(e);
                if (props.onChange) {
                  props.onChange(e.target.checked);
                }
              }}
            />
            <label htmlFor={props.name} className="order-2 !m-0 w-full block mb-2 text-sm font-medium text-gray-900">
              {props.label}
            </label>
          </>
        )}
      </Field>
      <ErrorMessage name={props.name} component="div" className="formik-error-msg"/>
    </div>
  );
}
