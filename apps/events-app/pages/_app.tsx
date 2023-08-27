
import { useState } from "react";
import { UserPassportContextProvider } from "../context/PassportContext";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'


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
        <UserPassportContextProvider>
          <Component {...pageProps} />
        </UserPassportContextProvider>
      </SessionContextProvider>


    </>
  );
};

export default App;
