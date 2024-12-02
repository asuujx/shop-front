import { isStrongPassword } from "validator";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z.string().refine((data) => isStrongPassword(data), {
      message: "Hasło jest za słabe",
    }),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła się nie zgadzają",
    path: ["repeatPassword"],
  });
