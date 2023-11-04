import { Label } from "@/components/ui/label";
import ZappCardComponentTemplate from "@/components/zapps/zappcardtemplate";
import { zAppCards } from "@/constant/zappcards";
import { Database } from "@/database.types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Button from "@/components/ui/buttons/Button";
import { X } from "lucide-react";
import { ArrowCircleRight, GithubLogo, Guilded } from "@/components/ui/icons";
import IconButton from "@/components/ui/buttons/IconButton";
import { BiHome, BiLogoGithub } from "react-icons/bi";
import Image from "next/image";

export default function Zapps() {
  const handleItemClick = (path: string) => {
    window.open(path, '_blank');
  }

  return (
    <div className="flex flex-col lg:p-0 sm:p-5 h-auto mt-32 lg:mt-0">
      {/* Zapps Header */}
      <div className="flex flex-col gap-5 py-8">
        <Label className="text-[31px] font-semibold">Zapps</Label>
        <div className="flex flex-col gap-[5px]">
          <Label className="text-white/70 text-lg font-bold">Use your <span className='text-green-400'>Zuzalu Passport</span> to access other community-built apps</Label>
          <Label className="opacity-40 text-sm font-semibold">Learn More about ZuPass (Zuzalu Passport)</Label>
        </div>
      </div>
      {/* Zapps Cards */}
      <div className="flex md:flex-row sm:flex-col overflow-auto md:w-full md:min-w-[1200px] border-b border-borderPrimary">
        <div className="flex md:flex-row sm:flex-col gap-4 pt-2.5 pb-5">
          {zAppCards.map((zAppCard) => (
            <Dialog>
              <DialogTrigger asChild>
                <a className="md:w-72 sm:w-full">
                  <ZappCardComponentTemplate
                    imgURL={zAppCard.imgURL}
                    appTitle={zAppCard.appTitle}
                    appDescription={zAppCard.appDescription}
                    appContents={zAppCard.appContents}
                    appTagLine={zAppCard.appTagLine}
                  />
                </a>
              </DialogTrigger>
              <DialogContent className="md:w-1/3 md:min-w-[800px] sm:w-full">
                <DialogHeader>
                  <DialogTitle className='pb-5'>
                    View App
                  </DialogTitle>
                  <hr className='bg-grayBackground' />
                  <DialogDescription className="text-white flex flex-col gap-2.5">
                    <Image className="rounded-lg" src={zAppCard.imgURL as string} alt="item-card" width={100} height={100} layout="responsive" loading="lazy" />
                    <div className="flex flex-col p-2.5 gap-2.5">
                      <Label className="text-white text-2xl font-bold">
                        {zAppCard.appTitle}
                      </Label>
                      <Label className="text-white/70 text-sm font-bold">
                        Create & participate in anonymous polls with ZuPass
                      </Label>
                      <div className="flex gap-2.5">
                        {
                          zAppCard.appContents &&
                          zAppCard.appContents.map((appContent) => {
                            return (
                              <Label className="py-1 px-2.5 bg-white/10 text-white/60 text-[13px] rounded-[10px] font-semibold">{appContent}</Label>
                            )
                          })
                        }
                      </div>
                      <Label className="text-white/70 text-base font-semibold">
                        {zAppCard.appDescription}
                      </Label>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex flex-row justify-end'>
                  {zAppCard.githubLink && <IconButton variant='dark' className="rounded-full" icon={BiLogoGithub} onClick={() => handleItemClick(zAppCard?.githubLink as string)} />}
                  {zAppCard.websiteLink && <IconButton variant='dark' className="rounded-full" icon={BiHome} onClick={() => handleItemClick(zAppCard?.websiteLink as string)} />}
                  <Button className='rounded-xl' leftIcon={ArrowCircleRight} onClick={() => handleItemClick(zAppCard.cardItemLink as string)}>Open App</Button>
                </DialogFooter>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Button size='sm' className='rounded-full w-10 h-10'><X /></Button>
                </DialogPrimitive.Close>
              </DialogContent>
            </Dialog>
          )
          )}
          <ZappCardComponentTemplate
            imgURL={undefined}
            appTitle={'Build With Zuzalu'}
            appDescription={''}
            appContents={undefined}
            appTagLine={'Integrate with ZuPass & add your app for the Zuzalu Community'}
          />
        </div>
      </div>
      {/* Zapps Footer */}
      <div className="flex flex-col gap-8 py-5">
        <div className="flex flex-col gap-[5px]">
          <Label className="text-white/70 text-xl font-bold">Want to integrate your app with Zuzalu?</Label>
          <Label className="text-lg opacity-40">Co-build with us!</Label>
        </div>
        <div className="flex gap-[30px]">
          <Button variant="quiet" className="rounded-[58px]" leftIcon={Guilded}>Guilded Community</Button>
          <Button variant="quiet" className="rounded-[58px]" leftIcon={GithubLogo}>Zuzalu Github</Button>
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
