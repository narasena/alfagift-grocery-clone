import { ErrorMessage, Field, FieldProps } from "formik";
import * as React from "react";

interface IAdminInputFieldBaseProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

interface IAdminInputFieldAsInputProps extends IAdminInputFieldBaseProps {
  as?: never;
  type?: string;
  rows?: never;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IAdminInputFieldAsTextAreaProps extends IAdminInputFieldBaseProps {
  as: "textarea";
  type?: never;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}


type TAdminInputFieldProps =
  IAdminInputFieldAsInputProps |
  IAdminInputFieldAsTextAreaProps 


export default function AdminInputField(props: TAdminInputFieldProps) {
  return (
    <div className={props.className}>
      <label htmlFor={props.name} className={`block mb-2 text-sm font-medium text-gray-900 `}>
        {props.label}
      </label>
      <Field name={props.name}>
        {({ field }: FieldProps) => 
          props.as === "textarea" ? (
            <textarea
              {...field}
              id={props.name}
              rows={(props as IAdminInputFieldAsTextAreaProps).rows}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder={props.placeholder}
              onChange={(e) => {
                field.onChange(e);
                if (props.onChange) {
                  (props as IAdminInputFieldAsTextAreaProps).onChange?.(e as React.ChangeEvent<HTMLTextAreaElement>);
                }
              }}
            />
          ) : (
            <input
              {...field}
              type={props.type}
              id={props.name}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder={props.placeholder}
              onChange={(e) => {
                field.onChange(e);
                if (props.onChange) {
                  (props as IAdminInputFieldAsInputProps).onChange?.(e as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            />
          )
        }
      </Field>
      <ErrorMessage name={props.name} component="div" className="text-xs p-0.5 text-white bg-red-600"/>
    </div>
  );
}
