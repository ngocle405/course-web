import { FieldType } from '@cores/utils/enums';

export interface FieldModel {
  name: string;
  label: string;
  type: FieldType;
  show: boolean;
  isDisabled: boolean;
  order: number;
  col: number;
  mandatory: boolean;
  objectMappingIn?: string;
  objectMappingOut?: string;
}

export interface FieldConfigModel {
  formKey?: string;
  label: string;
  name: string;
  objectMappingIn?: string;
  objectMappingOut?: string;
  format: {
    col: number;
    isDisabled: boolean;
    show: boolean;
    type: FieldType;
    mandatory: boolean;
    order: number;
  };
}
