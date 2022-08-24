

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
export interface CommonModel {
  name: string;
  value: string;
}


