import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type VerifyMailDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
};

function VerifyMailDialog({ open, setOpen, email }: VerifyMailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold mb-2">
            Zweryfikuj adres e-mail
          </DialogTitle>
          <DialogDescription className="text-center">
            Aby kontynuować, musisz zweryfikować swój adres e-mail.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              axios.post(
                "http://localhost:5000/auth/basic/resend-verification-email",
                { email }
              );
              setOpen(false);
            }}
            className="w-full mt-2"
          >
            Wyślij link aktywacyjny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyMailDialog;
