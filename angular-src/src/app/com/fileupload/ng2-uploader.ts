import { NgFileSelectDirective } from './directives/ng-file-select';
import { NgFileDropDirective } from './directives/ng-file-drop';

export * from './services/ng2-uploader';
export * from './directives/ng-file-select';
export * from './directives/ng-file-drop';

export const UPLOAD_DIRECTIVES: any[] = [
  NgFileDropDirective,
  NgFileSelectDirective
];