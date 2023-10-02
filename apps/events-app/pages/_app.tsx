import React, { useState } from 'react';
import { UserPassportContextProvider } from '../context/PassportContext';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import GlobalProvider from '../context/GlobalContext';
import '../styles/globals.css';
import '../styles/quill.css';
import { DashboardProvider } from '@/components/ui-providers/DashboardLayout';
import { QueryClient, QueryClientProvider } from 'react-query';
import { EventSpaceProvider } from '@/context/EventSpaceContext';


/**
 * This component wraps all pages in this Next.js application.
 */
const App = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const queryClient = new QueryClient();

  return (
    <>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <GlobalProvider user={pageProps.user}>
          <UserPassportContextProvider>
            <EventSpaceProvider>
              <DashboardProvider>
                <QueryClientProvider client={queryClient}>
                  <Component {...pageProps} />
                </QueryClientProvider>
              </DashboardProvider>
            </EventSpaceProvider>
          </UserPassportContextProvider>
        </GlobalProvider>
      </SessionContextProvider>
    </>
  );
};

export default App;
