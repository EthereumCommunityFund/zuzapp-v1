import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { useUserPassportContext } from "../../context/PassportContext";
import { useGlobalContext } from "../../context/GlobalContext";
import {
  createEventSpace,
  deleteEventSpace,
  fetchEventSpace,
  updateEventSpace,
} from "../../controllers";
import { timeStamp, trace } from "console";

/**
 * Landing page of events application
 */
export default function Home() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();

  return (
    <>
      <div className="mt-7 grid grid-cols-2 gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            signIn();
          }}
        >
          Passport Login
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const result = await createEventSpace({
                name: "new event space",
                event_space_type: "tracks",
              });

              console.log("result ", result);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Create event space
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            // ... (rest of the code for updating event space)
          }}
        >
          Update event space
        </button>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const result = await fetchEventSpace(
                "8fd49ab3-d84f-48d4-a9eb-e6d77661dd3b"
              );
              console.log("result ", result);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Get event space
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const result = await deleteEventSpace(
                "8fd49ab3-d84f-48d4-a9eb-e6d77661dd3b"
              );
              console.log("result ", result);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Delete event space
        </button>
      </div>

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
