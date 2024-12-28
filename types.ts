export interface Address {
  id: string;
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

export enum DataType {
  INTEGER = "integer",
  FLOAT = "float",
  STRING = "string",
  DICTIONARY = "dictionary",
}

export enum AttributeDataType {
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

export enum OfferStatus {
  REJECTED = "rejected",
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ProductStatus {
  WAITING = "waiting",
  APPROVED = "approved",
  REJECTED = "rejected",
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
  required: boolean;
  options: {
    id: string;
    value: string;
  }[];
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

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  status: OfferStatus;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
  product: {
    id: string;
    name: string;
    status: ProductStatus;
  };
  productState: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "canceled",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export interface Order {
  id: string;
  status: OrderStatus;
  cancelReason: string | null;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  offerId: string;
  deliveryAddressId: string;
}