export interface ICustomModel {
  open: boolean;
  setOpen: (open: boolena) => void;
  setRoute?: (route: string) => void;
  activeItem: any;
  component: any;
}
