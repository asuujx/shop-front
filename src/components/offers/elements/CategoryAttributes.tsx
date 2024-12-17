import { Attribute } from "types";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CategoryAttributesProps {
  data: {
    dbData: Attribute;
    value: string[];
  }[];
  handleChangeAttributeValue: (id: string, value: string[]) => void;
  isSuggestedProductSelected: boolean;
}

function CategoryAttributes({
  data,
  handleChangeAttributeValue,
  isSuggestedProductSelected,
}: CategoryAttributesProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      {data?.map((attribute) => {
        if (attribute.dbData.dataType === "dictionary") {
          if (attribute.dbData.isMultiSelect) {
            return (
              <MultiSelect
                key={attribute.dbData.id}
                options={attribute.dbData.options}
                onValueChange={(value) =>
                  handleChangeAttributeValue(attribute.dbData.id, value)
                }
                defaultValue={attribute.value[0] === "" ? [] : attribute.value}
                value={attribute.value[0] === "" ? [] : attribute.value}
                placeholder={attribute.dbData.name}
                disabled={isSuggestedProductSelected}
              />
            );
          } else {
            return (
              <Select
                key={attribute.dbData.id}
                value={attribute.value[0]}
                onValueChange={(value) =>
                  handleChangeAttributeValue(attribute.dbData.id, [value])
                }
                disabled={isSuggestedProductSelected}
              >
                <SelectTrigger>
                  <SelectValue placeholder={attribute.dbData.name} />
                </SelectTrigger>
                <SelectContent>
                  {attribute.dbData.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.value}
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
              value={attribute.value[0]}
              onChange={(e) =>
                handleChangeAttributeValue(attribute.dbData.id, [
                  e.target.value,
                ])
              }
              disabled={isSuggestedProductSelected}
            />
          );
        }
      })}
    </div>
  );
}

export default CategoryAttributes;
