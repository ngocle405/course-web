import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import * as lodash from 'lodash';
import { DataTable } from '../models/data-table.model';
import { FieldType } from './enums';

export function cleanDataForm(formGroup: UntypedFormGroup) {
  const form = formGroup;
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field);
    if (control instanceof UntypedFormControl && typeof control.value === 'string') {
      control.setValue(control?.value?.trim(), { emitEvent: false });
    } else if (control instanceof UntypedFormGroup) {
      cleanDataForm(control);
    } else if (control instanceof UntypedFormArray) {
      for (const form of control.controls) {
        cleanDataForm(form as UntypedFormGroup);
      }
    }
  });
  return form.getRawValue();
}

export function validateAllFormFields(formGroup?: UntypedFormGroup) {
  if (!formGroup) {
    return;
  }
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field);
    if (control instanceof UntypedFormControl) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
    } else if (control instanceof UntypedFormGroup) {
      validateAllFormFields(control);
    } else if (control instanceof UntypedFormArray) {
      for (const form of control.controls) {
        validateAllFormFields(form as UntypedFormGroup);
      }
    }
  });
}

export function mapDataTable(data: any, params: any) {
  return <DataTable<any>>{
    content: data?.content || [],
    currentPage: params?.page || 0,
    size: params?.size || 10,
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    first: (params?.size || 0) * (params?.page || 0),
  };
}

export function getNodeMenuByUrl(tree: any, value: string): any {
  let result = null;
  if (value === tree.routerLink) {
    return tree;
  } else if (tree.children) {
    for (let index = 0; index < tree.children.length; index++) {
      result = getNodeMenuByUrl(tree.children[index], value);
      if (result) {
        break;
      }
    }
  }
  return result;
}

export function removeParamNullOrUndefined(params: any) {
  const newParams: any = {};
  lodash.forEach(params, (value, key) => {
    if (!lodash.isNull(value) && !lodash.isUndefined(value)) {
      newParams[key] = value;
    }
  });
  return newParams;
}

export function convertDataField(value: any, type: FieldType) {
  if (!lodash.isNull(value) && !lodash.isUndefined(value)) {
    switch (type) {
      case FieldType.Date:
        return new Date(value);
      default:
        return value;
    }
  }
  return null;
}

export function convertToJson(value: string) {
  if (lodash.isString(value) && !lodash.isEmpty(value)) {
    return JSON.parse(value);
  }
  return null;
}

// Convert from Tree Data to Flat Data
export function flattenTreeData(data?: any[]): any[] {
  return lodash.reduce(
    data,
    (result: any[], current) => {
      return [...result, current, ...flattenTreeData(current.children)];
    },
    []
  );
}

export function dataURItoBlob(dataURI: any) {
  const byteString = window.atob(dataURI);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: 'application/octet-stream' });
  return blob;
}
