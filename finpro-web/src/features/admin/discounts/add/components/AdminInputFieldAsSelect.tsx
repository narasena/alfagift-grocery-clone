import { ErrorMessage, Field, FieldProps } from "formik";
import * as React from "react";

interface IAdminInputFieldAsSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  optionTitle: string;
  options: string[];
  onChange?: (value: string) => void;
}

export default function AdminInputFieldAsSelect(props: IAdminInputFieldAsSelectProps) {
  return (
    <div className={props.className}>
      <label htmlFor={props.name} className="block mb-2 text-sm font-medium text-gray-900 ">
        {props.label}
      </label>
      <Field name={props.name}>
        {({ field }: FieldProps) => (
          <select
            {...field}
            id={props.name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            onChange={(e) => {
              field.onChange(e);
              if (props.onChange) {
                props.onChange(e.target.value);
              }
            }}
          >
            <option value="">{props.optionTitle}</option>
            {props.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
          </Field>
          <ErrorMessage name={props.name} component="div" className="formik-error-msg"/>
    </div>
  );
}
