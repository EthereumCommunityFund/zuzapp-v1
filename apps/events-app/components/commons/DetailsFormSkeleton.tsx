import { Skeleton } from '@/components/ui/skeleton';

export const DetailsFormSkeleton = () => {
  return (
    <div className="py-10 px-4 flex flex-col items-center gap-8 rounded-2xl border border-white border-opacity-10 bg-componentPrimary w-full">
      <div className="flex flex-col gap-[34px] w-full">
        <Skeleton className="h-6 w-1/2 mb-3 rounded-md" />
        <Skeleton className="h-6 w-1/4 mb-3 rounded-md" />

        <Skeleton className="h-10 w-full mb-3 rounded-md" />

        <div className="flex gap-3">
          <div className="flex flex-col gap-[14px] w-full">
            <Skeleton className="h-6 w-1/4 mb-3 rounded-md" />
            <Skeleton className="h-10 w-full mb-3 rounded-md" />
          </div>
          <div className="flex flex-col gap-[14px] w-full">
            <Skeleton className="h-6 w-1/4 mb-3 rounded-md" />
            <Skeleton className="h-10 w-full mb-3 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-10 w-full mb-3 rounded-md" />

        <Skeleton className="h-10 w-full mb-3 rounded-md" />

        <Skeleton className="h-10 w-full mb-3 rounded-md" />

        <div className="space-y-10">
          <Skeleton className="h-6 w-1/2 mb-3 rounded-md" />
        </div>

        <div className="flex flex-col gap-[34px]">
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-6 w-1/2 mb-3 rounded-md" />
          </div>

          <div className="flex flex-col gap-6">
            <Skeleton className="h-6 w-1/4 mb-3 rounded-md" />
            <div className="flex gap-5">
              <Skeleton className="h-10 w-3/4 mb-3 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Skeleton className="h-6 w-1/4 mb-3 rounded-md" />
            <div className="flex gap-5">
              <Skeleton className="h-10 w-3/4 mb-3 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <div className="flex gap-[30px] w-full">
            <Skeleton className="h-10 w-1/2 rounded-full" />
            <Skeleton className="h-10 w-1/2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
