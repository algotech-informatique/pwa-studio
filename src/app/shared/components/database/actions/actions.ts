import { click, GetContextmenuAction } from '../../explorer/explorer-contextmenu-schema/tree-expander';
import { Row } from '../interfaces/row.interface';


export interface DataBaseAction {
  key: string;
  event?: any;
  value?: {
    key: string;
    row: Row;
    value: any;
  };
}

export const add: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'add',
  title: 'INSPECTOR.DATABASE.ADD.ACTION',
  content: '',
  icon: 'fa-plus',
  disabled,
  onClick

});

export const importSos: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'importSos',
  title: 'INSPECTOR.DATABASE.IMPORT.ACTION',
  content: '',
  icon: 'fa-arrows-up-to-line',
  disabled,
  onClick
});

export const markAllAsdeleted: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'markAllAsDeleted',
  title: 'INSPECTOR.DATABASE.MARK_ALL_AS_DELETED.ACTION',
  content: '',
  icon: 'fa-trash',
  disabled,
  onClick
});

export const markAsDeleted: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'markAsDeleted',
  title: 'INSPECTOR.DATABASE.DELETE.ACTION',
  content: '',
  icon: 'fa-trash',
  disabled,
  onClick
});


export const realDelete: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'realDelete',
  title: 'INSPECTOR.DATABASE.DELETE.DEFINITELY.ACTION',
  content: '',
  icon: 'fa-eraser',
  disabled,
  onClick
});

export const realDeleteAll: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'realDeleteAll',
  title: 'INSPECTOR.DATABASE.DELETE_ALL.ACTION',
  content: '',
  icon: 'fa-eraser',
  disabled,
  onClick
});


export const restoreSos: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'restoreSos',
  title: 'INSPECTOR.DATABASE.RESTORESOS.ACTION',
  content: '',
  icon: 'fa-trash-can-arrow-up',
  disabled,
  onClick
});

export const realDeleteAllTrashSos: GetContextmenuAction = (onClick: click, disabled?: boolean) =>  ({
    id: 'realDeleteAllTrashSos',
    title: 'INSPECTOR.DATABASE.DELETE_ALL_TRASH_SOS.ACTION',
    content: '',
    icon: 'fa-trash-can',
    disabled,
    onClick,
});

export const markAsDeletedDataBase: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'markAsDeletedDataBase',
  title: 'INSPECTOR.DATABASE.MARK_ALL_AS_DELETED.ACTION',
  content: '',
  icon: 'fa-trash',
  disabled,
  onClick
});

export const dumpDataBase: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'dump',
  title: 'INSPECTOR.DATABASE.DELETE_ALL.ACTION',
  content: '',
  icon: 'fa-eraser',
  disabled,
  onClick
});

export const restoreDB: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'restoreSos',
  title: 'INSPECTOR.DATABASE.RESTORESOS.ACTION',
  content: '',
  icon: 'fa-trash-can-arrow-up',
  disabled,
  onClick
});


export const deleteLink: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'deleteLink',
  title: 'INSPECTOR.DATABASE.DELETE_LINK.ACTION',
  content: '',
  icon: 'fa-trash-can-arrow-up',
  disabled,
  onClick
});

export const importSOs: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'importSOs',
  title: 'INSPECTOR.DATABASE.IMPORTSOS.ACTION',
  content: '',
  icon: 'fa-upload',
  disabled,
  onClick
});


export const downloadModel: GetContextmenuAction = (onClick: click, disabled?: boolean) => ({
  id: 'downloadModel',
  title: 'INSPECTOR.DATABASE.DOWNLOAD.MODEL',
  content: '',
  icon: 'fa-download',
  disabled,
  onClick
});
