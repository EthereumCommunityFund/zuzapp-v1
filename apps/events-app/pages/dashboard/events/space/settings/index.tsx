import { useState, useEffect } from 'react';
import Button from '@/components/ui/buttons/Button';
import { deleteEventSpaceById } from '@/services/deleteEventSpaces';
import { useEventSpace } from '@/context/EventSpaceContext';
import { useRouter } from 'next/router';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import InputFieldDark from '@/components/ui/inputFieldDark';
import { InputFieldType } from '@/types';
import { createInvite, fetchEventSpaceInvites, revokeInvite } from '@/controllers/invite.controller';
import { useQuery, useQueryClient } from 'react-query';
import { Loader } from '@/components/ui/Loader';
import fetchSpaceInvites from '@/services/fetchSpaceInvites';
import { v4 } from 'uuid';
import { HiXCircle } from 'react-icons/hi';
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const EventSpaceSettings = () => {
  const router = useRouter();
  const { event_space_id } = router.query;
  const { eventSpace } = useEventSpace();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const queryClient = useQueryClient();

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const {
    data: invites,
    isLoading: isInvitesLoading,
    isError,
  } = useQuery(
    ['inviteDetails'], // Query key
    () => fetchSpaceInvites(event_space_id as string), // Query function
    {
      enabled: !!event_space_id,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  );

  const handleSendInvite = async () => {
    if (email === '' || !isValidEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createInvite(
        {
          invitee_email: email,
          event_space_id: event_space_id as string,
        },
        event_space_id as string
      );
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['inviteDetails'] });
    } catch (error) {
      console.error('Error sending invite', error);
      const axiosError = error as AxiosErrorResponse;
      const errorMessage = axiosError.response?.data?.message || 'Error creating invite';
      toast({
        title: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveInvitee = async (id: string) => {
    console.log(event_space_id);
    try {
      const res = await revokeInvite(id, event_space_id as string);
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ['inviteDetails'] });
    } catch (error) {
      console.error('Error revoking invite', error);
    }
  };
  const handleDeleteEventSpace = async () => {
    if (!eventSpace) return;

    setIsLoading(true);
    try {
      await deleteEventSpaceById(eventSpace.id as string);
      router.push('/dashboard/events/myspaces');
    } catch (error) {
      console.error('Error deleting the event space', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (invites) {
    console.log(invites);
  }

  return (
    <>
      <div className="flex flex-col mx-auto py-5 px-4 gap-8 rounded-2xl bg-[#2E3131] w-full md:w-[600px]">
        <h1 className=" text-2xl">Event Space Members</h1>
        <div className="flex flex-col gap-2.5 self-stretch">
          <h2 className="font-bold text-xl opacity-70">Invite Editors</h2>
          <p className="text-sm font-medium">Invite other members via ZuPass to manage and edit this Event Space</p>
        </div>
        <div className="flex flex-col gap-6">
          <InputFieldDark type={InputFieldType.Primary} placeholder={'name@example.com'} value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />

          <Button className="rounded-lg flex justify-center" variant="blue" size="lg" type="button" onClick={handleSendInvite}>
            Invite To Space
          </Button>
          <h2 className="font-bold text-xl opacity-70">Members</h2>
        </div>
        <div className="flex flex-col gap-5">
          {isInvitesLoading ? (
            <Loader />
          ) : (
            <>
              {invites &&
                invites.map((invite: any) => {
                  const id = v4();
                  return (
                    <div key={id} className="flex justify-between">
                      <div className="hidden md:inline-block"></div>
                      <div className="flex text-sm font-medium opacity-70 justify-between md:justify-normal w-full md:w-auto md:gap-10 items-center">
                        <p className="">{invite.invitee_email}</p>
                        <p className="bg-[#67DBFF]/20 text-[#67DBFF] rounded-full text-xs py-1 px-2 block w-fit font-extrabold">{invite.status}</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              // onClick={() => handleRemoveInvitee(invite.id)}
                              className="py-1 px-2 flex items-center gap-1 text-[#FF5E5E] rounded-[20px] bg-[#EB5757]/20"
                            >
                              <HiXCircle />
                              <span>Remove</span>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] h-auto rounded-2xl">
                            <DialogHeader>
                              <DialogTitle>Remove Member?</DialogTitle>
                              <DialogDescription className="text-sm font-bold">Are you sure you want to remove this person ({invite.invitee_email}) from this space?</DialogDescription>
                              <DialogFooter className="pt-5">
                                <div className="flex justify-between items-center">
                                  <button className="py-2.5 px-3.5 flex items-center gap-1 rounded-[20px] bg-white/20">
                                    <span>Cancel</span>
                                  </button>
                                  <button onClick={() => handleRemoveInvitee(invite.id)} className="py-2.5 px-3.5 flex items-center gap-1 text-[#FF5E5E] rounded-[20px] bg-[#EB5757]/20">
                                    <HiXCircle />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </DialogFooter>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col mx-auto py-5 px-4 gap-8 rounded-2xl bg-[#2E3131] md:w-[600px] mt-4">
        <h1>Delete this event space</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button aria-disabled className="rounded-full flex justify-center" variant="red" size="lg" type="button" disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] h-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle>Delete space?</DialogTitle>
              <DialogDescription className="text-sm font-bold">Are you sure you want to delete this event space?</DialogDescription>
              <DialogFooter className="pt-5">
                <div className="flex justify-between items-center">
                  <button className="py-2.5 px-3.5 flex items-center gap-1 rounded-[20px] bg-white/20">
                    <span>Cancel</span>
                  </button>
                  <button onClick={handleDeleteEventSpace} className="py-2.5 px-3.5 flex items-center gap-1 text-[#FF5E5E] rounded-[20px] bg-[#EB5757]/20">
                    <HiXCircle />
                    <span>Delete</span>
                  </button>
                </div>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
