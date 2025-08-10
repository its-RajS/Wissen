export interface IProfile {
  user: any;
}

export interface ISideBar {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: () => void;
}
