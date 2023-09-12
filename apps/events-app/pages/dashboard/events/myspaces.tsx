import EventSpacesTemplate from "@/components/templates/events/EventSpacesTemplate"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"

export default function MyEventSpacesPage() {
  // Make request to get all event spaces

  return (
    <div className="flex gap-[10px] flex-1 items-center self-stretch">
      <EventSpacesTemplate />
    </div>
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