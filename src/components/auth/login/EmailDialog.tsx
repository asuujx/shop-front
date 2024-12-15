import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EmailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const emailSchema = z.object({
  email: z.string().email(),
});

function EmailDialog({ open, setOpen }: EmailDialogProps) {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    console.log(values);
    axiosInstance
      .post("/auth/basic/forgot-password", values)
      .then((response) => {
        if (response.status === 204) {
          setOpen(false);
          toast({
            title: "Wiadomość e-mail została wysłana",
          });
        }
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full text-right hover:underline">
        Odzyskaj hasło
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Zresetuj hasło</DialogTitle>
          <DialogDescription>
            Wyślij wiadomość e-mail z linkiem do resetowania hasła
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Adres e-mail" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Wyślij
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EmailDialog;
