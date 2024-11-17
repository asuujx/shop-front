import { isInt, isPostalCode, isStrongPassword, isTaxID } from "validator";
import { z } from "zod";

export const signUpBusinessSchema = z
  .object({
    // Personal data
    firstName: z.string().min(1, { message: "Imię jest wymagane" }),
    lastName: z.string().min(1, { message: "Nazwisko jest wymagane" }),
    email: z.string().email({ message: "Nieprawidłowy adres e-mail" }),
    password: z.string().refine((data) => isStrongPassword(data), {
      message: "Hasło jest za słabe",
    }),
    repeatPassword: z.string(),

    // Company data
    companyName: z.string().min(1, { message: "Nazwa jest wymagana" }),
    companyNip: z.string().refine((data) => isTaxID(data, "pl-PL"), {
      message: "Nieprawidłowy numer NIP",
    }),
    companyStreet: z.string().min(1, { message: "Ulica jest wymagana" }),
    // Building number can be a number followed by an optional letter
    companyBuilding: z.string().refine((data) => /^\d+[a-zA-Z]*$/.test(data), {
      message: "Nr. budynku jest wymagany",
    }),
    companyApartment: z
      .string()
      .refine((data) => data === "" || (isInt(data) && parseInt(data) > 0), {
        message: "Niepoprawny nr. lokalu",
      })
      .optional(),
    companyPostalCode: z.string().refine((data) => isPostalCode(data, "PL"), {
      message: "Nieprawidłowy kod pocztowy",
    }),
    companyCity: z.string().min(1, { message: "Miasto jest wymagane" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła się nie zgadzają",
    path: ["repeatPassword"],
  });
