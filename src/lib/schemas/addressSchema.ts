import { isInt, isPostalCode } from "validator";
import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1, { message: "Imię jest wymagane" }),
  lastName: z.string().min(1, { message: "Nazwisko jest wymagane" }),
  phoneNumber: z
    .string()
    .refine((data) => /^(\+?48)? ?\d{3} ?\d{3} ?\d{3}$/.test(data), {
      message: "Nieprawidłowy numer telefonu",
    }),
  companyName: z.string().optional(),
  postalCode: z.string().refine((data) => isPostalCode(data, "PL"), {
    message: "Nieprawidłowy kod pocztowy",
  }),
  city: z.string().min(1, { message: "Miasto jest wymagane" }),
  voivodeship: z.string().min(1, { message: "Województwo jest wymagane" }),
  street: z.string().min(1, { message: "Ulica jest wymagana" }),
  building: z.string().refine((data) => /^\d+[a-zA-Z]*$/.test(data), {
    message: "Nr. budynku jest wymagany",
  }),
  apartment: z
    .string()
    .refine((data) => data === "" || (isInt(data) && parseInt(data) > 0), {
      message: "Niepoprawny nr. lokalu",
    })
    .optional(),
});
