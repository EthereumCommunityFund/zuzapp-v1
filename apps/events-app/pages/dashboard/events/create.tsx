import CreateEventTemplate from "@/components/templates/events/CreateEventTemplate";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function CreateEventsPage() {
    return (
        <>
            <CreateEventTemplate />
        </>
    )
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