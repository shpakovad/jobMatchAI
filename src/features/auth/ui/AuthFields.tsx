import { Field, FieldGroup, FieldLabel } from "@/src/shared/ui/field";
import { Input } from "@/src/shared/ui/input";
import type { AuthMode } from "../model/types";
import { PasswordField } from "./PasswordField";
import { TranslationType } from "@/src/shared/types";

interface AuthFieldsProps {
  mode: AuthMode;
  translation: TranslationType;
}

export const AuthFields = ({ mode, translation }: AuthFieldsProps) => {
  const isSignUp = mode === "sign-up";

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="auth-email">Email</FieldLabel>
        <Input
          id="auth-email"
          type="email"
          placeholder={translation("Login.emailPlaceholder")}
          autoComplete="email"
        />
      </Field>
      <PasswordField
        id="auth-password"
        label={translation("Login.passwordLabel")}
        placeholder={translation("Login.passwordPlaceholder")}
        autoComplete={isSignUp ? "new-password" : "current-password"}
      />
      {isSignUp && (
        <PasswordField
          id="auth-confirm-password"
          label={translation("Login.confirmPasswordLabel")}
          placeholder={translation("Login.confirmPasswordLabel")}
          autoComplete="new-password"
        />
      )}
    </FieldGroup>
  );
};
