import { Skeleton } from '@/components/ui/skeleton';

export const EventTemplateSkeleton = () => {
  return (
    <div className="flex flex-row justify-between md:items-center border border-white/10 bg-[#2F3232E5] rounded-2xl px-3 md:px-5 py-5 mt-5">
      <div>
        <Skeleton className="w-fit h-4 mb-3 rounded-full" />
        <Skeleton className="h-6 w-3/4 mb-3" />
      </div>
      <div>
        <div className="w-full">
          <Skeleton className="w-full h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};
