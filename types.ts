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

export enum DataType {
  INTEGER = 'integer',
  FLOAT = 'float',
  STRING = 'string',
  DICTIONARY = 'dictionary',
}

export interface Attribute {
  id: string;
  name: string;
  dataType: DataType;
  required: boolean;
  unit: string;
  min: number;
  max: number;
  isMultiSelect: boolean;
  options: {id: string, value: string}[]
}