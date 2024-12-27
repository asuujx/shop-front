import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";

type SignUpDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
};

function SignUpDialog({ open, setOpen, email }: SignUpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold mb-2">Zweryfikuj adres e-mail</DialogTitle>
          <DialogDescription>
            Na adres <b>{email}</b> został wysłany link weryfikacyjny. Kliknij w
            link, aby dokończyć rejestrację.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignUpDialog;
