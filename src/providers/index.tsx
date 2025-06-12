"use client";

import { ProviderReactQuery } from "./provider-react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "./theme-provider";

interface IDataProvider {
  children: React.ReactNode;
}

export function Providers({ children }: IDataProvider) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProviderReactQuery>
        <ProgressBar
          height="4px"
          color="#009b46"
          options={{ showSpinner: true }}
          shallowRouting
        />
        {children}
      </ProviderReactQuery>
    </ThemeProvider>
  );
}
