import { Label } from "@/components/ui/label";
import ZappCardComponentTemplate from "@/components/zapps/zappcardtemplate";
import { zAppCards } from "@/constant/zappcards";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function Zapps() {
  return (
    <div className="flex flex-col lg:p-0 sm:p-5">
      {/* Zapps Header */}
      <div className="flex flex-col gap-[30px] py-8">
        <Label className="text-2xl font-semibold">Zapps</Label>
        <div className="flex flex-col gap-[5px]">
          <Label className="text-white/70 text-lg font-bold">Use your <span className='text-green-400'>Zuzalu Passport</span> to access other community-built apps</Label>
          <Label className="opacity-40">Learn More about ZuPass(Zuzalu Passport)</Label>
        </div>
      </div>
      {/* Zapps Cards */}
      <div className="flex md:flex-row sm:flex-col gap-4 pt-2.5 pb-5 overflow-x-hidden md:min-w-[1000px] border-b border-borderPrimary">
        {zAppCards.map((zAppCard) => {
          return (
            <ZappCardComponentTemplate
              imgURL={zAppCard.imgURL}
              appTitle={zAppCard.appTitle}
              appDescription={zAppCard.appDescription}
              appContents={zAppCard.appContents}
            />
          )
        })}
        <ZappCardComponentTemplate
          imgURL={undefined}
          appTitle={'Build With Zuzalu'}
          appDescription={'Integrate with ZuPass & add your app for the Zuzalu Community'}
          appContents={undefined}
        />
      </div>
      {/* Zapps Footer */}
      <div className="flex flex-col gap-8 py-5">
        <div className="flex flex-col gap-[5px]">
          <Label className="text-white/70 text-xl font-bold">Want to integrate your app with Zuzalu?</Label>
          <Label className="text-lg opacity-40">Here are several places to begin</Label>
        </div>
        <div className="flex gap-[30px]">
          <Label className="text-base font-semibold">Guilded Community</Label>
          <Label className="text-base font-semibold">Zuzalu Github</Label>
          <Label className="text-base font-semibold">Zupass Docs</Label>
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
