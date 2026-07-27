"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Field, FieldLabel } from "@/src/shared/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
}

export const PasswordField = ({ id, label, placeholder, autoComplete }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <InputGroupAddon
          align="inline-end"
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer"
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};
