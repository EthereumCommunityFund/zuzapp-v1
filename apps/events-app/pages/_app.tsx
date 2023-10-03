import React, { useEffect, useState } from "react";
import { UserPassportContextProvider } from "../context/PassportContext";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import GlobalProvider from "../context/GlobalContext";
import "../styles/globals.css";
import "../styles/quill.css";
import { DashboardProvider } from "@/components/ui-providers/DashboardLayout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query";

import { EventSpaceProvider } from "@/context/EventSpaceContext";
import { EventSpacesProvider } from "@/context/EventSpacesContext";
import { Toaster } from "@/components/ui/toaster";

/**
 * This component wraps all pages in this Next.js application.
 */
const App = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const queryClient = new QueryClient();

  useEffect(() => {
    const queryKeys = [
      "eventSpaces",
      "invitedSpaces",
      "publishedEventSpaces",
      "",
    ];

    queryKeys.forEach((key) => {
      const cache = localStorage.getItem(`react-query-cache-${key}`);
      if (cache) {
        const parsedCache = JSON.parse(cache);
        queryClient.setQueryData(key, parsedCache);
      }
    });

    // Save cache to localStorage on changes or before unloading
    const saveCache = () => {
      queryKeys.forEach((key) => {
        const currentCache = queryClient.getQueryData(key);
        if (currentCache) {
          localStorage.setItem(
            `react-query-cache-${key}`,
            JSON.stringify(currentCache)
          );
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
        <GlobalProvider user={pageProps.user}>
          <UserPassportContextProvider>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <EventSpaceProvider>
                  <DashboardProvider>
                    <Component {...pageProps} />
                    <Toaster />
                  </DashboardProvider>
                </EventSpaceProvider>
              </Hydrate>
            </QueryClientProvider>
          </UserPassportContextProvider>
        </GlobalProvider>
      </SessionContextProvider>
    </>
  );
};

export default App;
