import React, { useEffect, useState } from "react";
import { UserPassportContextProvider } from "../context/PassportContext";
import {
  createPagesBrowserClient,
  createPagesServerClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import GlobalProvider from "../context/GlobalContext";
import "../styles/globals.css";
import "../styles/quill.css";
import "../styles/toggle.css";
import { DashboardProvider } from "@/components/ui-providers/DashboardLayout";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { EventSpaceProvider } from "@/context/EventSpaceContext";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import localforage from "localforage";
import Head from "next/head";
import NProgress from "nprogress";

const MyApp = ({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const queryClient = new QueryClient();
  const router = useRouter();

  let event_space_id = "";

  if (router.query.event_space_id) {
    event_space_id = router.query.event_space_id as string;
  }

  useEffect(() => {
    const handleRouteChangeStart = () => NProgress.start();
    const handleRouteChangeComplete = () => NProgress.done();
    const handleRouteChangeError = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router.events]);
  useEffect(() => {
    localforage.config({
      driver: localforage.INDEXEDDB,
      name: "zuzalu_city",
      storeName: "eventspace_store",
    });

    const queryKeys = [
      "eventSpaces",
      "invitedSpaces",
      // "publishedEventSpaces",
      ["currentEventSpace", event_space_id],
      ["trackDetails", event_space_id],
    ];

    queryKeys.forEach(async (key) => {
      if (Array.isArray(key)) {
        let [queryKey, id] = key;
        if (!id) return;
        const cache = await localforage.getItem(
          `react-query-cache-${queryKey}-${id}`
        );
        if (cache) {
          const parsedCache = JSON.parse(cache as string);
          queryClient.setQueryData([queryKey, id], parsedCache);
        }
      } else {
        const cache = await localStorage.getItem(`react-query-cache-${key}`);
        if (cache) {
          const parsedCache = JSON.parse(cache);
          queryClient.setQueryData(key, parsedCache);
        }
      }
    });

    // Save cache to localStorage on changes or before unloading
    const saveCache = () => {
      queryKeys.forEach(async (key) => {
        if (Array.isArray(key)) {
          let [queryKey, id] = key;
          const currentCache = queryClient.getQueryData([queryKey, id]); // Use [queryKey, id] here
          if (currentCache) {
            await localforage.setItem(
              `react-query-cache-${queryKey}-${id}`,
              JSON.stringify(currentCache)
            );
          }
        } else {
          const currentCache = queryClient.getQueryData(key);
          if (currentCache) {
            await localforage.setItem(
              `react-query-cache-${key}`,
              JSON.stringify(currentCache)
            );
          }
        }
      });
    };

    const unsubscribe = queryClient.getQueryCache().subscribe(saveCache);

    window.addEventListener("beforeunload", saveCache);

    return () => {
      if (unsubscribe) {
        unsubscribe;
      }
      window.removeEventListener("beforeunload", saveCache);
    };
  }, [queryClient]);

  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <QueryClientProvider client={queryClient}>
          <GlobalProvider user={pageProps.user}>
            <UserPassportContextProvider>
              <Hydrate state={pageProps.dehydratedState}>
                <EventSpaceProvider>
                  <DashboardProvider props={pageProps}>
                    <Head>
                      <link
                        rel="stylesheet"
                        type="text/css"
                        href="/path_to_your_css_folder/nprogress.css"
                      />
                    </Head>
                    <Component {...pageProps} />
                    <Toaster />
                  </DashboardProvider>
                </EventSpaceProvider>
              </Hydrate>
            </UserPassportContextProvider>
          </GlobalProvider>
        </QueryClientProvider>
      </SessionContextProvider>
    </>
  );
};

export default MyApp;
