import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Category } from "types";

interface SuggestedCategoriesProps {
  query: string;
  form: any;
  category: Category | null;
  setCategory: (category: Category) => void;
}

const fetchCategories = async (query: string) => {
  const response = await axiosInstance.get<Category[]>(
    `/categories/suggestions?query=${query}`
  );
  return response.data;
};

function SuggestedCategories({ query, form, category, setCategory }: SuggestedCategoriesProps) {
  const { data: categories, refetch: refetchSuggestedCategories } = useQuery({
    queryKey: ["categories", "suggested", query],
    queryFn: () => fetchCategories(query),
    enabled: query.length >= 3,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {
  //   if (query.length >= 3 && !category?.id) {
  //     refetchSuggestedCategories()
  //   }
  // }, [query, category?.id]);

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
                setCategory(categories!.find(category => category.id === value)!);
              }}
              defaultValue={category?.id}
              value={category?.id}
              className="flex flex-col gap-5"
            >
              {category && <div
                  className="flex items-center gap-2 border rounded-lg px-2 py-4"
                  key={category.id}
                >
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id}>
                    {category.name}
                  </Label>
                </div>}
              {categories?.filter(_category => _category.id !== (category?.id ?? false)).map((category: any) => (
                <div
                  className="flex items-center gap-2 border rounded-lg px-2 py-4"
                  key={category.id}
                >
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id}>
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
