import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

/** The dark form field used across the auth drawer, footer signup, contact
 *  form, membership waitlist, and admin forms — `.input-dark` + `.field`. */
export function Input({ label, className, id, ...rest }: InputProps) {
  const input = (
    <input id={id} className={`input-dark${className ? " " + className : ""}`} {...rest} />
  );
  if (!label) return input;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {input}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className, id, ...rest }: TextareaProps) {
  const textarea = (
    <textarea id={id} className={`input-dark${className ? " " + className : ""}`} {...rest} />
  );
  if (!label) return textarea;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {textarea}
    </label>
  );
}

export default Input;
