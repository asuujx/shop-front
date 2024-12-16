import { DataType } from "@/../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, X } from "lucide-react";
import { useState } from "react";
import { Attribute, attributeSchema } from "./CreateCategoryForm";

interface CreateCategoryFormAttributesProps {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}

const defaultAttributeValues: Attribute = {
  name: "",
  dataType: DataType.INTEGER,
  required: "true",
  unit: "",
  //   min: "",
  //   max: "",
  isMultiSelect: "true",
  options: "",
};

const CreateCategoryFormAttributes = ({
  attributes,
  setAttributes,
}: CreateCategoryFormAttributesProps) => {
  const [attributeValues, setAttributeValues] = useState<Attribute>(
    defaultAttributeValues
  );

  const handleAttributeValuesChange = (key: string, value: string) => {
    const updatedAttributeValues = { ...attributeValues, [key]: value };
    setAttributeValues({ ...updatedAttributeValues });
  };

  const handleAddAttribute = () => {
    const result = attributeSchema.safeParse(attributeValues);

    if (result.success) {
      setAttributes((prev) => [...prev, attributeValues]);
      setAttributeValues(defaultAttributeValues);
    }
  };

  const handleEditAttribute = (index: number) => {
    setAttributeValues(attributes[index]);
    handleRemoveAttribute(index);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const dataTypes = Object.values(DataType);

  return (
    <div>
      <p className="font-bold text-lg">Cechy</p>
      <p className="text-sm text-gray-500">
        Utwórz cechy, które będą przypisane do kategorii.
      </p>

      <div>
        <div className="flex flex-wrap gap-2">
          {attributes.map((attribute, index) => (
            <div className="border rounded-lg flex pl-2 py-0.5" key={index}>
              <p className="mr-1">{attribute.name}</p>
              <Button
                onClick={() => handleEditAttribute(index)}
                size="icon"
                variant="secondary"
                className="w-6 h-6 mr-1"
              >
                <Edit />
              </Button>
              <Button
                onClick={() => handleRemoveAttribute(index)}
                size="icon"
                variant="destructive"
                className="w-6 h-6"
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-3">
            <Label htmlFor="name">Nazwa</Label>
            <Input
              id="name"
              value={attributeValues.name}
              onChange={(e) =>
                handleAttributeValuesChange("name", e.target.value)
              }
              placeholder="np. Rozmiar"
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="dataType">Typ cechy</Label>
            <Select
              onValueChange={(value) =>
                handleAttributeValuesChange("dataType", value)
              }
              value={attributeValues.dataType}
            >
              <SelectTrigger id="dataType">
                <SelectValue placeholder="Typ cechy" />
              </SelectTrigger>
              <SelectContent>
                {dataTypes.map((dataType) => (
                  <SelectItem key={dataType} value={dataType}>
                    {dataType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-3">
            <Label htmlFor="required">Wymagana?</Label>
            <Select
              onValueChange={(value) =>
                handleAttributeValuesChange("required", value)
              }
              value={attributeValues.required}
            >
              <SelectTrigger id="required">
                <SelectValue placeholder="Wymagane" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Tak</SelectItem>
                <SelectItem value="false">Nie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(attributeValues.dataType === DataType.INTEGER ||
            attributeValues.dataType === DataType.FLOAT) && (
            <div className="mb-3">
              <Label htmlFor="unit">Jednostka</Label>
              <Input
                id="unit"
                value={attributeValues.unit}
                onChange={(e) =>
                  handleAttributeValuesChange("unit", e.target.value)
                }
                placeholder="np. mm"
              />
            </div>
          )}
          {attributeValues.dataType === DataType.DICTIONARY && (
            <>
              <div className="mb-3">
                <Label htmlFor="isMultiSelect">Wielokrotnego wyboru?</Label>
                <Select
                  onValueChange={(value) =>
                    handleAttributeValuesChange("isMultiSelect", value)
                  }
                  value={attributeValues.isMultiSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Tak</SelectItem>
                    <SelectItem value="false">Nie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-3">
                <Label htmlFor="options">Opcje</Label>
                <p className="text-xs text-gray-500">
                  Wpisz opcje oddzielone przecinkami
                </p>
                <Input
                  value={attributeValues.options}
                  onChange={(e) =>
                    handleAttributeValuesChange("options", e.target.value)
                  }
                  placeholder="np. S, M, L, XL"
                />
              </div>
            </>
          )}
          <Button
            className="mt-1"
            variant="secondary"
            disabled={
              attributeSchema.safeParse(attributeValues).success === false
            }
            onClick={handleAddAttribute}
          >
            Dodaj cechę
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateCategoryFormAttributes;
