import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { deleteEventSpaceById } from "@/services/deleteEventSpaces";
import { useEventSpace } from "@/context/EventSpaceContext";
import { useRouter } from "next/router";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import InputFieldDark from "@/components/ui/inputFieldDark";
import { InputFieldType } from "@/types";
import { createInvite } from "@/controllers/invite.controller";

const EventSpaceSettings = () => {
  const { eventSpace } = useEventSpace();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState([])
  const router = useRouter();

  const handleSendInvite = async () => {
    if (email === "") return;
    try {
      await createInvite({
        invitee_email: email,
        event_space_id: eventSpace?.id as string,
      });
      setEmail("");
      // router.push("/dashboard/events/myspaces");
    } catch (error) {
      console.error("Error sending invite", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEventSpace = async () => {
    if (!eventSpace) return;

    setIsLoading(true);
    try {
      await deleteEventSpaceById(eventSpace.id as string);
      router.push("/dashboard/events/myspaces");
    } catch (error) {
      console.error("Error deleting the event space", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col font-inter py-5 px-4 self-stretch gap-8 rounded-2xl bg-[#2E3131]">
        <h1 className=" text-2xl">Event Space Members</h1>
        <div className="flex flex-col gap-2.5 self-stretch">
          <h2 className="font-bold text-xl opacity-70">Invite Editors</h2>
          <p className="text-sm font-medium">
            Invite other members via ZuPass to manage and edit this Event Space
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <InputFieldDark
            type={InputFieldType.Primary}
            placeholder={"name@example.com"}
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          />

          <Button
            className="rounded-lg flex justify-center"
            variant="blue"
            size="lg"
            type="button"
            onClick={handleSendInvite}
          >
            Invite To Space
          </Button>
          <h2 className="font-bold text-xl opacity-70">Members</h2>
        </div>
      </div>
      <div className="flex gap-[10px] flex-1 mt-5 items-center self-stretch font-inter">
        <h1>Delete this event space</h1>
        <Button
          aria-disabled
          className="rounded-full flex justify-center"
          variant="red"
          size="lg"
          type="button"
          onClick={handleDeleteEventSpace}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </>
  );
};

export default EventSpaceSettings;

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
