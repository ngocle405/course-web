import { FieldConfigModel } from './field.model';

export interface FormProcessModel {
  formKey: string;
  name: string;
  processKey?: string;
  properties?: FieldConfigModel[];
}
