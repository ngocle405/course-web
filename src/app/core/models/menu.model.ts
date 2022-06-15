import { MenuItem } from 'primeng/api';

export interface MenuModel extends MenuItem {
  path: string | null;
  active: boolean;
  children?: MenuModel[];
}
