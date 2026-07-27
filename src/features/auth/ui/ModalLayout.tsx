"use client";

import type { FormEvent, ReactNode } from "react";
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
import { Button } from "@/src/shared/ui/button";
import { TranslationType } from "@/src/shared/types";

interface ModalLayoutProps {
  description: ReactNode;
  translation: TranslationType;
  children: ReactNode;
  submitText: string;
}

export const ModalLayout = ({
  description,
  translation,
  children,
  submitText,
}: ModalLayoutProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <Dialog>
        <form onSubmit={handleSubmit} autoComplete="off">
          <DialogTrigger render={<Button type="button">{translation("Login.title")}</Button>} />
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{translation("Login.welcomeLabel")}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    {translation("Login.cancelLabel")}
                  </Button>
                }
              />
              <Button type="submit">{submitText}</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
