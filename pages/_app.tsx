import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/wallet.css";
import "@/styles/walletDetails.css";
import "@/styles/animate.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
