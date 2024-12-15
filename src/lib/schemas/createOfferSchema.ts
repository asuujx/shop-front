import { z } from "zod";

export const createOfferSchema = z.object({
  title: z.string().min(5, { message: "Tytuł jest za krótki" }),
  description: z.string().min(10, { message: "Opis jest za krótki" }),
  // price: z.string().refine(
  //   (data) => {
  //     isNumeric(data, { locale: "pl-PL" });
  //   },
  //   { message: "Cena musi być liczbą" }
  // ),
  price: z.coerce.number().positive().min(1, { message: "Cena musi być większa od 0" }),
  productStateId: z.string(),
  // productImages: z.array(z.instanceof(File)),
  productId: z.string(),
});
