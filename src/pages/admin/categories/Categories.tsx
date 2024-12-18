import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { DataType } from "types";
import CategoriesList from "./CategoriesList";
import CreateCategory from "./CreateCategory";

export interface BaseCategory {
  attributes: Attribute[];
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  parentId: string;
  isLeaf: boolean;
  children: BaseCategory[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  isLeaf: boolean;
  parentId: string | null;
  attributes: Attribute[];
}

interface Attribute {
  id: string;
  name: string;
  dataType: DataType;
  required: boolean;
  unit: string;
  min: number;
  max: number;
  isMultiSelect: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  options: Option[];
}

interface Option {
  id: string;
  value: string;
  attributeId: string;
}

const getBaseCategories = async () => {
  const response = await axiosInstance.get<BaseCategory[]>("/categories/base");
  return response.data;
};

const getCategoriesAlphabetical = async () => {
  const response = await axiosInstance.get<Category[]>(
    "/categories?sort=name:asc"
  );
  return response.data;
};

const Categories = () => {
  const { data: baseCategoriesData, isSuccess: baseCategoriesIsSuccess } =
    useQuery({
      queryKey: ["categories", "base"],
      queryFn: getBaseCategories,
    });

  const { data: categoriesData, isSuccess: categoriesIsSuccess } = useQuery({
    queryKey: ["categories", "list", "alphabetical"],
    queryFn: getCategoriesAlphabetical,
  });

  const isReady =
    baseCategoriesIsSuccess &&
    categoriesIsSuccess &&
    categoriesData &&
    baseCategoriesData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategorie</CardTitle>
        <CardDescription>
          Formularze umożliwiające wykonywanie operacji na kategoriach.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isReady && <p>Ładowanie...</p>}
        {isReady && (
          <>
            <CategoriesList data={baseCategoriesData} />
            <Separator className="my-4" />
            <CreateCategory data={categoriesData} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
export default Categories;
