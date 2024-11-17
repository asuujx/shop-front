import { isStrongPassword } from "validator";
import { z } from "zod";

export const signUpPersonalSchema = z
  .object({
    firstName: z.string({ message: "Imię jest wymagane" }),
    lastName: z.string({ message: "Nazwisko jest wymagane" }),
    email: z.string().email({ message: "Nieprawidłowy adres e-mail" }),
    password: z
      .string()
      .refine((data) => isStrongPassword(data), {
        message:
          "Hasło jest za słabe",
      }),
    repeatPassword: z
      .string()
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła się nie zgadzają",
    path: ["repeatPassword"],
  });
