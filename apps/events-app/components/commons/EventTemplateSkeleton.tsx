import { Skeleton } from '@/components/ui/skeleton';

export const EventTemplateSkeleton = () => {
  return (
    <div className="flex flex-row justify-between md:items-center border border-white/10 bg-[#2F3232E5] rounded-2xl px-3 md:px-5 py-5 mt-5">
      <div>
        <Skeleton className="h-4 w-24 mb-2 rounded-md" />
        <Skeleton className="h-6 w-32 mb-2 rounded-md" />
      </div>
      <div>
        <div className="mt-3 md:mt-0">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};
