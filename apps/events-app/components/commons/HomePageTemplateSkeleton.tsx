import { Skeleton } from '@/components/ui/skeleton';

export const HomePageTemplateSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary rounded-lg px-3 md:px-5 py-3 mt-5">
      <div className="flex flex-col md:flex-row space-x-3 md:items-center">
        <div>
          <Skeleton className="w-36 h-24 rounded-md" /> {/* Adjust width and height based on your Image component */}
        </div>
        <div className="space-y-2 mt-2 md:mt-0">
          <Skeleton className="h-6 w-32 mb-2 rounded-md" />
          <Skeleton className="h-4 w-24 mb-2 rounded-md" />
          <div className="flex space-x-2">
            <div className="flex items-center text-xs md:text-sm rounded-full py-2 px-3 w-fit">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="flex items-center text-xs md:text-sm rounded-full py-2 px-3 w-fit">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 md:mt-0">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
};
