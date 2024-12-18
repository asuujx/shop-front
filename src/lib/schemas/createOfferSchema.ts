import { z } from "zod";

export const createOfferSchema = z.object({
  title: z.string().min(5, { message: "Tytuł jest za krótki" }),
  description: z.string().min(10, { message: "Opis jest za krótki" }),
  price: z.coerce
    .number()
    .positive({ message: "Cena musi być większa od 0" })
    .min(1),
  productStateId: z.string(),
});
