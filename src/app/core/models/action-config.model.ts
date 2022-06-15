import { ScreenType } from '../utils/enums';

export interface ActionConfig {
  title: string;
  screenType?: ScreenType;
  component?: any;
  dialog?: {
    width: string;
  };
}
