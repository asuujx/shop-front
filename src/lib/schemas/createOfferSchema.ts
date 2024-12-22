import { isDecimal, toFloat } from "validator";
import { z } from "zod";

export const createOfferSchema = z.object({
  title: z.string().min(5, { message: "Tytuł jest za krótki" }),
  description: z.string().min(10, { message: "Opis jest za krótki" }),
  price: z
    .string()
    .min(1, { message: "Cena jest wymagana" })
    .refine((value) => isDecimal(value, {decimal_digits: '2'}), {
      message: "Cena musi być liczbą",
    })
    .refine((value) => toFloat(value) > 0, {
      message: "Cena musi być większa od 0",
    }),
  productStateId: z.string(),
});
