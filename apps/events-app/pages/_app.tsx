
import React, { useState } from "react";
import { UserPassportContextProvider } from "../context/PassportContext";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import GlobalProvider from "../context/GlobalContext";
import '../styles/globals.css'
import { DashboardProvider } from "@/components/ui-providers/DashboardLayout";

/**
 * This component wraps all pages in this Next.js application.
 */
const App = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient())


  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <GlobalProvider user={pageProps.user}>
          <UserPassportContextProvider>
            <DashboardProvider>
              <Component {...pageProps} />
            </DashboardProvider>
          </UserPassportContextProvider>
        </GlobalProvider >
      </SessionContextProvider>

    </>
  );
};

export default App;



