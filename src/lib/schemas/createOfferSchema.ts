import { z } from "zod";

const createOfferSchemaAttribute = z.object({
  productCategoryAttributeId: z.string().uuid(),
  value: z.array(z.string()),
});

export const createOfferSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, { message: "Umieść co najmniej 1 zdjęcie" })
    .max(5, { message: "Umieść maksymalnie 5 zdjęć" }),
  title: z
    .string()
    .min(5, { message: "Tytuł musi składać się co najmniej 5 znaków" }),
  description: z
    .string()
    .min(10, { message: "Opis musi składać się z co najmniej 10 znaków" }),
  price: z.coerce.number().positive({ message: "Cena musi być większa od 0 zł" }),
  categoryId: z.string().uuid({ message: "Należy wybrać kategorię" }),
  productId: z.string().uuid().or(z.literal("(null)")),
  productStateId: z.string().uuid({ message: "Należy wybrać stan produktu" }),
  attributes: z.array(createOfferSchemaAttribute),
});
