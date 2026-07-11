/* Angry Tiger button — primary = red fill / black text; secondary = 2px
   currentColor outline; ghost = red text. Every variant swaps to solid red
   with black text on hover (see globals.css .btn). Labels never wrap. */

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size}${className ? " " + className : ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
