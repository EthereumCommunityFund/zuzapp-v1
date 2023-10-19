import { Loader } from "@/components/ui/Loader";
import Button from "@/components/ui/buttons/Button";
import { ArrowLeft } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUsername } from "@/controllers/profile.controllers";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { FaCircleArrowDown } from "react-icons/fa6";

export default function UserProfile(props: any) {
  const { profile } = props;
  const [userName, setUsername] = useState<string>('');
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUpdateUserProfile = async () => {
    setIsLoading(true);
    const res = await updateUsername({ username: userName });
    setIsProfileUpdated(true);
    setIsLoading(false);
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <div className='lg:px-40 sm:px-0 flex lg:min-w-[900px] w-full lg:flex-row sm:flex-col'>
      <div className='pt-5 rounded-[10px] flex lg:flex-col sm:flex-row gap-2.5 items-center'>
        <Button variant="quiet-SM" className="text-xl" leftIcon={ArrowLeft}>Back</Button>
        <div className="flex flex-col gap-2.5 py-2 px-3.5 sm:hidden lg:flex">
          <Label className="text-xl">User Profile</Label>
          <Label className="text-white/70">Avatar, Bio, Username</Label>
        </div>
        <Label className="text-xl lg:hidden sm:flex">Your Profile</Label>
      </div>
      <div className='lg:pt-10 sm:pt-3 lg:px-[30px] pb-40 lg:rounded-[10px] flex flex-col gap-5 w-full'>
        <Label className="text-xl sm:hidden lg:flex">Your Profile</Label>
        <div className='px-4 py-5 bg-componentPrimary lg:rounded-2xl flex flex-col gap-5 lg:min-w-[900px] border border-borderPrimary sm:w-full'>
          {/* Avatar */}
          <div className="gap-2.5 pb-5 flex flex-col border-b">
            <Label className="font-bold text-xl opacity-90">Avatar</Label>
            <Label className="font-bold text-base opacity-90">200 x 200 Min. Upload PNG, GIF or JPEG</Label>
            <div className="flex gap-5 items-center">
              <img src="" width={60} height={60} alt="avatar" />
              <Button variant='quiet' className="rounded-2xl h-10">Upload</Button>
            </div>
          </div>
          {/* Bio */}
          <div className="gap-2.5 pb-5 flex flex-col border-b">
            <Label className="font-bold text-xl opacity-90">Bio</Label>
            <Label className="font-bold text-sm opacity-70">A short bio to introduce yourself</Label>
            <textarea placeholder="Received the title of Big Boss" className='text-white py-3 px-2 placeholder-[#AAAAAA] bg-inputField outline-none rounded-[8px] text-sm border border-borderPrimary sm:w-full lg:h-auto sm:h-40' />
          </div>
          {/* Display Name */}
          <div className="gap-2.5 pb-5 flex flex-col border-b">
            <Label className="font-bold text-xl opacity-90">Display Name</Label>
            <Label className="font-bold text-sm opacity-70">Change your username</Label>
            <Input type="text" placeholder={profile[0].username} className='text-white py-3 px-2 placeholder-[#AAAAAA] bg-inputField outline-none rounded-[8px] text-sm border border-borderPrimary' value={userName} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button size="lg" leftIcon={FaCircleArrowDown} className='w-44 rounded-xl justify-center md:text-base sm:text-sm' onClick={handleUpdateUserProfile}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
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
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
