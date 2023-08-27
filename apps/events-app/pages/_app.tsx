
import { useState } from "react";
import { UserPassportContextProvider } from "../context/PassportContext";
import { createPagesBrowserClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import GlobalProvider from "../context/GlobalContext";
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
            <Component {...pageProps} />
          </UserPassportContextProvider>
        </GlobalProvider >
      </SessionContextProvider>

    </>
  );
};

export default App;



