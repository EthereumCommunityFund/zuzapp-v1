import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function Resources() {
  return <div>Resources Page</div>;
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
