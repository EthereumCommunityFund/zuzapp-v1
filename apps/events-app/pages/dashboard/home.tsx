import HomePageTemplate from "@/components/templates/HomePageTemplate";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { useGlobalContext } from "@/context/GlobalContext";

export default function DashboardHomePage() {
  // console.log(profile, "profile");
  const { profile } = useGlobalContext();
  return <>{<HomePageTemplate />}</>;
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
  // const { data: profile, error } = await supabase
  //   .from("profile")
  //   .select("*")
  //   .eq("uuid", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
