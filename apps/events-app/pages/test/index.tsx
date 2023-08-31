import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useUserPassportContext } from "../../context/PassportContext";
import { useGlobalContext } from "../../context/GlobalContext";
import { createEventSpace, deleteEventSpace, fetchEventSpace, updateEventSpace } from "../../controllers";
import { timeStamp, trace } from "console";



/**
 * Landing page of events application
 */
export default function Home() {
  const { signIn } = useUserPassportContext()
  const { isAuthenticated, user } = useGlobalContext();
  
  const updateData = {
    name: "davik",
    event_space_type: "tracks",
    start_date: Date.now(),
    end_date: Date.now()+ 5000,
    description:"new description",
    format: "in-person",
    event_type: ["Great"],
    experience_level: ["Expert"],
    status: "draft"
  }
  
  
  return (
    <>
      <button onClick={ async()=> {
      signIn()
      }}>Passport Login</button>
      <button onClick={ async()=> {
        try {
          const result = await  createEventSpace({name: "new event space", event_space_type: "tracks"})
          console.log('result ', result)
        } catch (error) {
            console.log(error)
        }
    
      }}>Create event space</button>
      <button onClick={ async()=> {
        try {
          const result = await  updateEventSpace("2c612bc1-3349-462c-b802-46fd5a905e60", updateData)
          console.log('result ',result)
        } catch (error) {
            console.log(error)
        }
    
        
      }}>Update event space</button>
      <button onClick={ async()=> {
        
        try {
          const result = await fetchEventSpace("2c612bc1-3349-462c-b802-46fd5a905e60")
          console.log('result ',result)
        } catch (error) {
            console.log(error)
        }
    
      }}>Get event space</button>
      <button onClick={ async()=> {
        try {
          const result = await deleteEventSpace("2c612bc1-3349-462c-b802-46fd5a905e60")
          console.log('result ',result)
        } catch (error) {
            console.log(error)
        }
    
      }}>Delete event space</button>
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