import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/src/shared/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group";
import { FieldGroup, Field, FieldLabel } from "@/src/shared/ui/field";

export const SignUpModal = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
        <Input id="fieldgroup-email" type="email" placeholder="Enter email" autoComplete="off" />
      </Field>
      <Field>
        <FieldLabel htmlFor="inline-end-input1">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            type={showPassword ? "text" : "password"}
            id="inline-end-input1"
            placeholder="Enter password"
          />
          <InputGroupAddon
            align="inline-end"
            onClick={togglePasswordVisibility}
            className="cursor-pointer"
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="inline-end-input2">Confirm password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            type={showPassword ? "text" : "password"}
            id="inline-end-input2"
            placeholder="Confirm password"
          />
          <InputGroupAddon
            align="inline-end"
            onClick={togglePasswordVisibility}
            className="cursor-pointer"
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  );
};
