import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useUserPassportContext } from "../context/PassportContext";
import { useGlobalContext } from "../context/GlobalContext";



/**
 * Landing page of events application
 */
export default function Home() {
  const { signIn } = useUserPassportContext()
  const { isAuthenticated, user } = useGlobalContext();

  
  return (
    <>
      <button onClick={signIn}>Passport Login</button>
      {isAuthenticated && <div>Logged in {user.email}</div>}
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