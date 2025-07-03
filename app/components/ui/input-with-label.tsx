import { HTMLInputTypeAttribute } from "react";
import { Input } from "./input";
import { Label } from "./label";

type InputWithLabelProps = {
  placeholder: string;
  inputType: HTMLInputTypeAttribute;
  htmlFor: string;
  label: string;
  name?: string;
};
export function InputWithLabel({
  placeholder,
  inputType,
  htmlFor,
  label,
  name,
  ...props
}: InputWithLabelProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label className="text-gray-600 font-normal" htmlFor={htmlFor}>
        {label}
      </Label>
      <Input
        type={inputType}
        id={htmlFor}
        name={name}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
