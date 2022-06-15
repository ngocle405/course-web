export interface CommonCategoryModel {
  code: string;
  name: string;
  value: string | number | null;
  description?: string;
  page?: number;
  size?: number;
  commons?: CommonModel[];
}

export interface CommonModel {
  id?: any;
  fromDate?: any;
  fromTime?: any;
  toDate?: any;
  toTime?: any;
  selectedSupervisor2?: any;
  selectedLeave2?: any;
  code?: string;
  name?: string;
  value?: any;
  orderNum?: number;
  isDefault?: boolean;
  description?: string;
}

export interface WardModel {
  countryCode: string;
  provinceCode: string;
  districtCode: string;
  wardsCode: string;
  address: string;
}
