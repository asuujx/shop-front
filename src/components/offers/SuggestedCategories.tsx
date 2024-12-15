import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface SuggestedCategoriesProps {
  query: string;
  form: any;
  setCategoryId: (categoryId: string) => void;
}

const fetchCategories = async (query: string) => {
  const response = await axiosInstance.get(
    `/categories/suggestions?query=${query}`
  );
  return response.data;
};

function SuggestedCategories({ query, form, setCategoryId }: SuggestedCategoriesProps) {
  const { data: categories } = useQuery({
    queryKey: ["categories", query],
    queryFn: () => fetchCategories(query),
    enabled: query.length >= 3,
    staleTime: 10000,
  });

  // console.log(categories);

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                setCategoryId(value);
              }}
              defaultValue={field.value}
              className="flex flex-col gap-5"
            >
              {categories?.map((category: any) => (
                <div
                  className="flex items-center gap-2 border rounded-lg px-2 py-4"
                  key={category.id}
                >
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id} className="text-md">
                    {category.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SuggestedCategories;
