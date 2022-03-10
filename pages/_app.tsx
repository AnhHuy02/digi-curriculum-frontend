import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Provider as StoreProvider } from "react-redux";

import DashboardLayout from "src/components/_Layout/DashboardLayout";
import theme from "../src/constants/theme.const";
import createEmotionCache from "../src/helper/createEmotionCache";
import { store } from "../src/redux/_store";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
  pageTitle?: string;
}

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    pageTitle,
  } = props;

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => <DashboardLayout>{page}</DashboardLayout>);

  return getLayout(
    <StoreProvider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{pageTitle ?? "Digi Curriculum"}</title>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </StoreProvider>
  );
};

export default MyApp;
