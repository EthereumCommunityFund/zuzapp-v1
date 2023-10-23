import { Label } from "@/components/ui/label";
import ZappCardComponentTemplate from "@/components/zapps/zappcardtemplate";
import { zAppCards } from "@/constant/zappcards";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RenderHTMLString from "@/components/ui/RenderHTMLString";
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Button from "@/components/ui/buttons/Button";
import { X } from "lucide-react";
import { ArrowCircleRight } from "@/components/ui/icons";
import IconButton from "@/components/ui/buttons/IconButton";
import { BiHome, BiLogoGithub } from "react-icons/bi";

export default function Zapps() {
  return (
    <div className="flex flex-col lg:p-0 sm:p-5 h-auto">
      {/* Zapps Header */}
      <div className="flex flex-col gap-[30px] py-8">
        <Label className="text-2xl font-semibold">Zapps</Label>
        <div className="flex flex-col gap-[5px]">
          <Label className="text-white/70 text-lg font-bold">Use your <span className='text-green-400'>Zuzalu Passport</span> to access other community-built apps</Label>
          <Label className="opacity-40">Learn More about ZuPass(Zuzalu Passport)</Label>
        </div>
      </div>
      {/* Zapps Cards */}
      <div className="flex md:flex-row sm:flex-col gap-4 pt-2.5 pb-5 overflow-x-hidden md:w-[1500px] border-b border-borderPrimary">
        {zAppCards.map((zAppCard) => {
          return (
            <Dialog>
              <DialogTrigger asChild>
                <a>
                  <ZappCardComponentTemplate
                    imgURL={zAppCard.imgURL}
                    appTitle={zAppCard.appTitle}
                    appDescription={zAppCard.appDescription}
                    appContents={zAppCard.appContents}
                  />
                </a>
              </DialogTrigger>
              <DialogContent className="w-1/3">
                <DialogHeader>
                  <DialogTitle className='pb-5'>
                    View App
                  </DialogTitle>
                  <hr className='bg-grayBackground' />
                  <DialogDescription className="text-white">
                    <img className="rounded-lg" src={zAppCard.imgURL} alt="item-card" />
                    <div className="flex flex-col">
                      <Label className="text-white text-2xl font-bold">
                        {zAppCard.appTitle}
                      </Label>
                      <Label className="text-white/70 text-xl font-bold">
                        Create & participate in anonymous polls with ZuPass
                      </Label>
                      <div className="flex">
                        {
                          zAppCard.appContents &&
                          zAppCard.appContents.map((appContent) => {
                            return (
                              <Label className="py-1 px-2.5 bg-itemBgPrimary text-white/60 text-sm rounded-xl">{appContent}</Label>
                            )
                          })
                        }
                      </div>
                      <Label className="text-white/70 text-base font-semibold">
                        {zAppCard.appFullDescription}
                      </Label>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex flex-row justify-end'>
                  <IconButton variant='dark' className="rounded-full" icon={BiLogoGithub} />
                  <IconButton variant='dark' className="rounded-full" icon={BiHome} />
                  <Button className='rounded-xl' leftIcon={ArrowCircleRight}>Open App</Button>
                </DialogFooter>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Button size='sm' className='rounded-full w-10 h-10'><X /></Button>
                </DialogPrimitive.Close>
              </DialogContent>
            </Dialog>
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
