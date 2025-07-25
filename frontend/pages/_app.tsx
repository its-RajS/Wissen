import { AppProps } from "next/app";
import React from "react";

export default function myApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
