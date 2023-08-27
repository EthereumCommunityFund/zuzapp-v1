import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { UserPassportContext, useUserPassportContext } from "../context/PassportContext";
import { PCD_GITHUB_URL } from "../src/constants";
import axios from "axios";

/**
 * Landing page of the example 'consumer client' application, which is a
 * directory of examples for how to use the PCD SDK and integrate with
 * the passport.
 */
export default function Page() {
  const { signIn } = useUserPassportContext()
  return (
    <button onClick={signIn}>Sign In</button>
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