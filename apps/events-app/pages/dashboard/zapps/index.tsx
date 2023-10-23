import { Label } from "@/components/ui/label";
import ZappCardComponentTemplate from "@/components/zapps/zappcardtemplate";
import { zAppCards } from "@/constant/zappcards";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function Zapps() {
  return (
    <div className="flex flex-col">
      {/* Zapps Header */}
      <div className="flex flex-col gap-[30px]">
        <Label className="text-2xl">Zapps</Label>
        <div className="flex flex-col gap-[5px]">
          <Label className="text-white/70 text-base">User your <span className='text-green-400'>Zuzalu Passport</span> to access other community-built apps</Label>
          <Label className="opacity-40">Learn More about ZuPass(Zuzalu Passport)</Label>
        </div>
      </div>
      {/* Zapps Cards */}
      <div className="flex gap-4">
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
          imgURL={''}
          appTitle={'Build With Zuzalu'}
          appDescription={'Integrate with ZuPass & add your app for the Zuzalu Community'}
          appContents={[]}
        />
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
