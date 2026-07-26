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
import { FieldGroup, Field, FieldLabel } from "@/src/shared/ui/field";
import { Button } from "@/src/shared/ui/button";
import { TranslationProps } from "@/src/shared/types";

export const LoginModal = ({ translation }: TranslationProps) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button>{translation("Login.title")}</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{translation("Login.welcomeLabel")}</DialogTitle>
            <DialogDescription>{translation("Login.description")}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
              <Input id="fieldgroup-email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="fieldgroup-email">Password</FieldLabel>
              <Input id="fieldgroup-password" type="password" />
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
