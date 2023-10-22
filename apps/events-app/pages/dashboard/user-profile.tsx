import { Loader } from "@/components/ui/Loader";
import Button from "@/components/ui/buttons/Button";
import { ArrowLeft } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/components/ui/use-toast";
import { useGlobalContext } from "@/context/GlobalContext";
import {
  fetchProfile,
  updateUsername,
} from "@/controllers/profile.controllers";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaCircleArrowDown } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi";
import { useQueryClient } from "react-query";

export default function UserProfile() {
  const { profile, loadProfile } = useGlobalContext();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [userName, setUsername] = useState<string>("");
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdateUserProfile = async () => {
    // this validation is a quick fix, refactor this into something more robust for the form elements
    if (!userName) {
      toast({ title: "Username cannot be empty", variant: "destructive" });
      return;
    }

    if (userName === profile.username) {
      toast({
        title: "Username cannot be the same as previous username",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateUsername({ username: userName });
      await loadProfile();
      setIsProfileUpdated(true);
      setIsLoading(false);
    } catch (error: any) {
      toast({ title: error.response.data.message, variant: "destructive" });
      console.log("error while updating profile", error);
      setIsLoading(false);
    }
  };

  const handleEnterHomePage = () => {
    try {
      router.push({
        pathname: "/dashboard/home",
      });
    } catch (error) {
      console.error("Error redirecting schedulelists", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="lg:px-40 sm:px-0 flex lg:min-w-[900px] w-full lg:flex-row sm:flex-col">
      {isProfileUpdated ? (
        <>
          <div className="pt-40 flex flex-col items-center">
            <h3 className="font-bold text-xl">Your Profile Has Been Updated</h3>
            <Button
              onClick={handleEnterHomePage}
              variant="primary"
              className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full"
              leftIcon={HiArrowRight}
            >
              Go to HomePage
            </Button>
          </div>
        </>
      ) : (
        <>
          {profile && (
            <>
              <div className="pt-5 rounded-[10px] flex lg:flex-col sm:flex-row gap-2.5 items-center">
                <Button
                  variant="quiet-SM"
                  className="text-xl"
                  leftIcon={ArrowLeft}
                >
                  Back
                </Button>
                <div className="flex flex-col gap-2.5 py-2 px-3.5 sm:hidden lg:flex">
                  <Label className="text-xl">User Profile</Label>
                  <Label className="text-white/70">Avatar, Bio, Username</Label>
                </div>
                <Label className="text-xl lg:hidden sm:flex">
                  Your Profile
                </Label>
              </div>
              <div className="lg:pt-10 sm:pt-3 lg:px-[30px] pb-40 lg:rounded-[10px] flex flex-col gap-5 w-full">
                <Label className="text-xl sm:hidden lg:flex">
                  Your Profile
                </Label>
                <div className="px-4 py-5 bg-componentPrimary lg:rounded-2xl flex flex-col gap-5 lg:min-w-[900px] border border-borderPrimary sm:w-full">
                  {/* Avatar */}
                  <div className="gap-2.5 pb-5 flex flex-col border-b">
                    <Label className="font-bold text-xl opacity-90">
                      Avatar
                    </Label>
                    <Label className="font-bold text-base opacity-90">
                      200 x 200 Min. Upload PNG, GIF or JPEG
                    </Label>
                    <div className="flex gap-5 items-center">
                      <img src="" width={60} height={60} alt="avatar" />
                      <Button variant="quiet" className="rounded-2xl h-10">
                        Upload
                      </Button>
                    </div>
                  </div>
                  {/* Bio */}
                  <div className="gap-2.5 pb-5 flex flex-col border-b">
                    <Label className="font-bold text-xl opacity-90">Bio</Label>
                    <Label className="font-bold text-sm opacity-70">
                      A short bio to introduce yourself
                    </Label>
                    <textarea
                      placeholder="Received the title of Big Boss"
                      className="text-white py-3 px-2 placeholder-[#AAAAAA] bg-inputField outline-none rounded-[8px] text-sm border border-borderPrimary sm:w-full lg:h-auto sm:h-40"
                    />
                  </div>
                  {/* Display Name */}
                  <div className="gap-2.5 pb-5 flex flex-col border-b">
                    <Label className="font-bold text-xl opacity-90">
                      Display Name
                    </Label>
                    <Label className="font-bold text-sm opacity-70">
                      Change your username
                    </Label>
                    <Input
                      type="text"
                      placeholder={profile.username}
                      className="text-white py-3 px-2 placeholder-[#AAAAAA] bg-inputField outline-none rounded-[8px] text-sm border border-borderPrimary"
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="lg"
                      leftIcon={FaCircleArrowDown}
                      className="w-44 rounded-xl justify-center md:text-base sm:text-sm"
                      onClick={handleUpdateUserProfile}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>{" "}
            </>
          )}
        </>
      )}
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
