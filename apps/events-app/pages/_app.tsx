import React, { useEffect, useState } from "react";
import { UserPassportContextProvider } from "../context/PassportContext";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import GlobalProvider from "../context/GlobalContext";
import "../styles/globals.css";
import "../styles/quill.css";
import { DashboardProvider } from "@/components/ui-providers/DashboardLayout";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { EventSpaceProvider } from "@/context/EventSpaceContext";
import { EventSpacesProvider } from "@/context/EventSpacesContext";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";

/**
 * This component wraps all pages in this Next.js application.
 */
const App = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const queryClient = new QueryClient();
  const router = useRouter();

  let event_space_id = "";

  if (router.query.event_space_id) {
    event_space_id = router.query.event_space_id as string;
  }

  useEffect(() => {
    const queryKeys = [
      "eventSpaces",
      "invitedSpaces",
      "publishedEventSpaces",
      ["currentEventSpace", event_space_id],
      ["trackDetails", event_space_id],
    ];

    queryKeys.forEach((key) => {
      if (Array.isArray(key)) {
        let [queryKey, id] = key;
        console.log(queryKey, id);
        const cache = localStorage.getItem(
          `react-query-cache-${queryKey}-${id}`
        );
        if (cache) {
          const parsedCache = JSON.parse(cache);
          queryClient.setQueryData([queryKey, id], parsedCache);
        }
      } else {
        const cache = localStorage.getItem(`react-query-cache-${key}`);
        if (cache) {
          const parsedCache = JSON.parse(cache);
          queryClient.setQueryData(key, parsedCache);
        }
      }
    });

    // Save cache to localStorage on changes or before unloading
    const saveCache = () => {
      queryKeys.forEach((key) => {
        if (Array.isArray(key)) {
          let [queryKey, id] = key;
          console.log(queryKey, id);
          const currentCache = queryClient.getQueryData([queryKey, id]); // Use [queryKey, id] here
          if (currentCache) {
            localStorage.setItem(
              `react-query-cache-${queryKey}-${id}`,
              JSON.stringify(currentCache)
            );
          }
        } else {
          const currentCache = queryClient.getQueryData(key);
          if (currentCache) {
            localStorage.setItem(
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
