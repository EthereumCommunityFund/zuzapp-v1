import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database, EventSpaceRow } from "@/database.types";
import { useUserPassportContext } from "../../context/PassportContext";
import { useGlobalContext } from "../../context/GlobalContext";
import { EventSpaceData } from "@/types";
import {
  createEventSpace,
  fetchAllEventSpaces,
  deleteEventSpace,
  fetchEventSpace,
  fetchEventSpacesByUser,
  updateEventSpace,
} from "../../controllers";
import { timeStamp, trace } from "console";
import { useEffect, useState } from "react";
import { generateRandomEventSpaceUpdateData } from "@/utils";
import { deleteLocation } from "@/controllers/location.controllers";

/**
 * Landing page of events application
 */
export default function Home() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const [lastCreatedEventSpace, setLastCreatedEventSpace] =
    useState<EventSpaceData | null>(null);

  console.log(lastCreatedEventSpace);

  useEffect(() => {
    fetchEventSpacesByUser().then((res) => {
      setLastCreatedEventSpace(res.data[res.data.length - 1]);
    });
  }, []);

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

              let res = await fetchEventSpacesByUser();
              setLastCreatedEventSpace(res.data[res.data.length - 1]);
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
            if (lastCreatedEventSpace) {
              const eventSpaceUpdateObject = generateRandomEventSpaceUpdateData(
                lastCreatedEventSpace.id
              );
              const result = await updateEventSpace(
                lastCreatedEventSpace.id,
                eventSpaceUpdateObject
              );

              console.log(result, "res");
              let res = await fetchEventSpacesByUser();
              console.log("res", res);
              setLastCreatedEventSpace(res.data[res.data.length - 1]);
            }
          }}
        >
          Update event space
        </button>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              if (!lastCreatedEventSpace) return;
              const result = await fetchEventSpace(lastCreatedEventSpace.id);
              console.log("result ", result);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Get event space
        </button>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const result = await fetchAllEventSpaces();
              console.log("result ", result);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Get All event spaces
        </button>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              if (!lastCreatedEventSpace) return;
              const result = await fetchEventSpacesByUser();
              console.log("result ", result);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Get event space by user
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              if (!lastCreatedEventSpace) return;
              const result = await deleteEventSpace(lastCreatedEventSpace.id);
              console.log("result ", result);
              let res = await fetchEventSpacesByUser();
              console.log("res", res);
              setLastCreatedEventSpace(res.data[res.data.length - 1]);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Delete event space
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              console.log("last evet", lastCreatedEventSpace);
              if (!lastCreatedEventSpace) return;

              if (
                lastCreatedEventSpace.eventspacelocation &&
                lastCreatedEventSpace.eventspacelocation.length > 0
              ) {
                if (!lastCreatedEventSpace.eventspacelocation[0].id) return;
                const result = await deleteLocation(
                  lastCreatedEventSpace.eventspacelocation[0].id
                );
                console.log("result ", result);
                let res = await fetchEventSpacesByUser();
                console.log("res", res);
                setLastCreatedEventSpace(res.data[res.data.length - 1]);
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Delete Location
        </button>
      </div>

      {lastCreatedEventSpace &&
        lastCreatedEventSpace.eventspacelocation &&
        lastCreatedEventSpace?.eventspacelocation?.length > 0 && (
          <div className="mt-5 p-4 border rounded">
            <h2>Event Space Locations:</h2>
            {lastCreatedEventSpace.eventspacelocation.map((location, idx) => (
              <div key={location.id} className="mb-2">
                <span>
                  {location.name} - {location.description}
                </span>
                <button
                  className="ml-3 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={async () => {
                    try {
                      if (!location.id) return;
                      const result = await deleteLocation(location.id);
                      console.log("Deleted location result:", result);
                      const res = await fetchEventSpacesByUser();
                      setLastCreatedEventSpace(res.data[res.data.length - 1]);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  Delete Location
                </button>
              </div>
            ))}
          </div>
        )}

      {isAuthenticated && <div>Logged in {user.email}</div>}

      {lastCreatedEventSpace && (
        <div className="mt-5 p-4 border rounded">
          <h2>Last Created Event Space:</h2>
          <p>Name: {lastCreatedEventSpace.name}</p>
          <p>Type: {lastCreatedEventSpace.event_space_type}</p>
        </div>
      )}
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
