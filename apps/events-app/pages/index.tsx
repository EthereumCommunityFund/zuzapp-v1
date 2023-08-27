import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { UserPassportContext, useUserPassportContext } from "../context/PassportContext";
import { PCD_GITHUB_URL } from "../src/constants";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";

/**
 * Landing page of events application
 */
export default function Home() {
  const { signIn } = useUserPassportContext()
  const { isAuthenticated } = useGlobalContext();

  return (
    <>
      <button onClick={signIn}>Sign In</button>
      {isAuthenticated && <div>signed in</div>}
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx)
  let {
    data: { session },
  } = await supabase.auth.getSession()


  if (!session)
    return {
      props: {
        initialSession: null,
        user: null
      },
    }




  // get profile from session 
  const { data: profile, error } = await supabase
    .from('profile')
    .select('*')
    .eq('uuid', session.user.id);


  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile
    },
  }



}