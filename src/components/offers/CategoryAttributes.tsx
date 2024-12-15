import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Attribute } from "types";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategoryAttributesProps {
  categoryId: string;
  setFormAttributes: (data: any) => void;
}

const fetchCategoryAttributes = async (categoryId: string) => {
  const response = await axiosInstance.get(
    `/categories/${categoryId}/attributes`
  );
  return response.data;
};

function CategoryAttributes({ categoryId, setFormAttributes }: CategoryAttributesProps) {
  const { data: categoryAttributes, isSuccess } = useQuery<Attribute[]>({
    queryKey: ["categoryAttributes", categoryId],
    queryFn: () => fetchCategoryAttributes(categoryId),
    enabled: !!categoryId,
  });

  const [attributes, setAttributes] = useState<
    { dbData: Attribute; productCategoryAttributeId: string; value: string[] }[]
  >([]);

  console.log(attributes);

  const onAttributeChange = (
    productCategoryAttributeId: string,
    value: string[]
  ) => {
    const newAttributes = attributes.map((attribute) => {
      if (attribute.productCategoryAttributeId === productCategoryAttributeId) {
        return {
          ...attribute,
          value,
        };
      }
      return attribute;
    });

    setAttributes(newAttributes);

	const formAttributes = newAttributes.map((attribute) => ({
		productCategoryAttributeId: attribute.productCategoryAttributeId,
		value: attribute.value,
	}));

	setFormAttributes(formAttributes);
  };

  useEffect(() => {
    if (isSuccess && !!categoryAttributes) {
      const transform = categoryAttributes.map((attribute) => ({
        dbData: attribute,
        productCategoryAttributeId: attribute.id,
        value: [],
      }));

      setAttributes(transform);
    }
  }, [categoryAttributes]);

  // console.log(categoryAttributes);

  return (
    <div className="flex flex-col gap-5 py-4">
      {attributes?.map((attribute) => {
        if (attribute.dbData.dataType === "dictionary") {
          if (attribute.dbData.isMultiSelect) {
            return (
              <MultiSelect
                key={attribute.dbData.id}
                options={attribute.dbData.options}
                onValueChange={(value) =>
                  onAttributeChange(attribute.dbData.id, value)
                }
                defaultValue={[]}
                placeholder={attribute.dbData.name}
              />
            );
          } else {
            return (
              <Select
                key={attribute.dbData.id}
                onValueChange={(value) =>
                  onAttributeChange(attribute.dbData.id, [value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={attribute.dbData.name} />
                </SelectTrigger>
                <SelectContent>
                  {attribute.dbData.options.map((value) => (
                    <SelectItem key={value.id} value={value.id}>
                      {value.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }
        } else {
          return (
            <Input
              key={attribute.dbData.id}
              placeholder={attribute.dbData.name}
              onChange={(e) =>
                onAttributeChange(attribute.dbData.id, [e.target.value])
              }
            />
          );
        }
      })}
    </div>
  );
}

export default CategoryAttributes;
