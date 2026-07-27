import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/ui/dialog";
import { Input } from "@/src/shared/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group";
import { FieldGroup, Field, FieldLabel } from "@/src/shared/ui/field";
import { Button } from "@/src/shared/ui/button";
import { TranslationProps } from "@/src/shared/types";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export const SignInModal = ({ translation }: TranslationProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button>{translation("Login.title")}</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{translation("Login.welcomeLabel")}</DialogTitle>
            <DialogDescription>
              {translation("Login.description")}
              <Button variant="ghost" className="text-slate-100 hover:text-slate-500">
                {translation("Login.description1")}
              </Button>
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
              <Input
                id="fieldgroup-email"
                type="email"
                placeholder="Enter email"
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="inline-end-input">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  id="inline-end-input"
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
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">{translation("Login.cancelLabel")}</Button>}
            />
            <Button type="submit">{translation("Login.title")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
