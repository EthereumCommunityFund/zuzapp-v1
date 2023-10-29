
import { Label } from "@/components/ui/label";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUserPassportContext } from "@/context/PassportContext";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { ZuConnectResourceItemCards, ZuzaluResouceItemCards } from "@/constant/resourcecards";
import ResourcesItemCard from "@/components/resources/ResourcesItemCard";
import Image from "next/image";

export default function Resources() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user, profile } = useGlobalContext();
  return (
    <div className="flex flex-col w-full">
      {/* Resources Header */}
      <div className='p-10 flex flex-col gap-5'>
        <Label className='text-3xl text-white'>Zuzalu Resources</Label>
        <Label className='text-white/70 text-lg'>A great list of resources by the Zuzalu Community</Label>
      </div>
      <div className="flex flex-col justify-center">
        {/* PlayBook Header */}
        <div className="flex justify-center">
          <div className="pt-5 md:pl-10 sm:px-10 pb-10 flex flex-col gap-5 md:w-4/5 sm:w-full">
            <Label className="text-white/70 text-lg font-semibold">Zuzalu</Label>
            <div className='justify-center'>
              <div className="flex flex-col gap-2.5 items-center w-full">
                {ZuzaluResouceItemCards.map((resourceItemCard) => (
                  <ResourcesItemCard
                    title={resourceItemCard.title}
                    tagLine={resourceItemCard.tagLine}
                    prevLink={resourceItemCard.prevLink}
                    fullLink={resourceItemCard.fullLink}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* ZuConnect Resources */}
        <div className="flex justify-center">
          <div className="pt-5 md:pl-10 sm:px-10 pb-10 flex flex-col gap-5 md:w-4/5 sm:w-full">
            <Label className="text-white/70 text-lg">ZuConnect</Label>
            {isAuthenticated && profile ? (
              <div className="flex flex-col gap-2.5">
                {ZuConnectResourceItemCards.map((resourceItemCard) => (
                  <ResourcesItemCard
                    title={resourceItemCard.title}
                    tagLine={resourceItemCard.tagLine}
                    prevLink={resourceItemCard.prevLink}
                    fullLink={resourceItemCard.fullLink}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="p-5 bg-componentPrimary rounded-2xl border border-borderPrimary">
                  <div className="flex flex-col gap-2.5 p-5 items-center">
                    <Label className="text-xl text-white/70">To view these resources, please connect your ZuPass.</Label>
                    <div className="flex space-x-2 items-center rounded-3xl px-5 py-2 h-full bg-dark text-sm md:text-base justify-center hover:cursor-pointer" onClick={signIn}>
                      <Image src="/images/zaluza blackandwhite.png" width={20} height={20} alt="Passport" className="mr-2" loading="lazy" />
                      Connect <span className="hidden md:inline"> Passport</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
