export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  postalCode: string;
  city: string;
  voivodeship: string;
  street: string;
  building: string;
  apartment: string;
}

enum AttributeDataType {
  INTEGER = "integer",
  FLOAT = "float",
  STRING = "string",
  DICTIONARY = "dictionary",
}

export interface Attribute {
  id: string;
  name: string;
  dataType: AttributeDataType;
  required: boolean;
  unit: string;
  isMultiSelect: boolean;
  options: { id: string; value: string }[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  parentId: string | null;
  children: Category[];
}

export interface ProductAttribute {
  id: string;
  categoryAttributeId: string;
  name: string;
  value: string;
  options: {
    id: string;
    value: string;
  }[];
}

enum ProductStatus {
  WAITING = "waiting",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  categoryId: string;
  authorId: string;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
  attributes: ProductAttribute[];
}
