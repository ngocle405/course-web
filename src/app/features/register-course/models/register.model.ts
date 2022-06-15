import { CommonModel } from '@common-category/models/common-category.model';

export interface RegisterModel {
  name?: string;
  phone?: string;
  email?: string;
  companyAddress?: string;
  level?: number;
  know?: string;
  note?: string;
}
export interface StateCourse {
  getCourseList: CommonModel[];
  listAddressCompany: CommonModel[];
  listLevel: CommonModel[];
  listKnow: CommonModel[];
}
