import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const Providers = (children: { children: React.ReactNode }) => {
  return <Provider store={store}>{children.children}</Provider>;
};

export default Providers;
