import CreateEventTemplate from "@/components/templates/events/CreateEventTemplate";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import Container from "@/components/ui/Container";

export default function CreateEventsPage() {
  return (
    <div className="mx-auto md:w-[80%] w-[95%] py-10">
      <CreateEventTemplate />
    </div>
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
