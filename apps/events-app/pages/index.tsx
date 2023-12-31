import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { useUserPassportContext } from "../context/PassportContext";
import { useGlobalContext } from "../context/GlobalContext";
import React from "react";

/**
 * Landing page of events application
 */
export default function Home() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();

  return (
    <>
      <button className="bg-blue-500" onClick={signIn}>
        Passport Login
      </button>
      {isAuthenticated && <div>Logged in {user.email}</div>}
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: null,
        user: null,
      },
    };

  // get profile from session
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("uuid", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
