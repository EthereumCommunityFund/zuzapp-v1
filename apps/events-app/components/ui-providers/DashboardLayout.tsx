import { useRouter } from "next/router";
import DashboardNavigation from "../navigation/Dashboard";
import DashboardHeader from "../navigation/Header";
import { eventRoutes, eventViewRoutes } from "@/constant/routes";
import SubHeader from "../navigation/Header/SubHeader";
import dynamic from "next/dynamic";
// import EventViewNavigation from "../navigation/EventView"

const EventViewNavigation = dynamic(() => import("../navigation/EventView"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const checkIfCurrentRouteIsInDashboardRoutes = () => {
    const routes = eventRoutes;
    const currentRoute = routes.find((route) => route.path === router.pathname);
    if (currentRoute) return true;
    return false;
  };

  const checkIfCurrentRouteIsInEventViewRoutes = () => {
    const routes = eventViewRoutes;
    const currentRoute = routes.find((route) => route.path === router.pathname);
    if (currentRoute) return true;
    return false;
  };

  if (!router.pathname.startsWith("/dashboard"))
    return (
      <div className="bg-[#222222] text-white relative min-h-screen">
        {children}
      </div>
    );
  return (
    <>
      <div className="flex relative bg-[#222222] text-white md:h-14 md:flex-col sm:h-14 sm:flex-col">
        {
          !checkIfCurrentRouteIsInEventViewRoutes() ? (
            <DashboardNavigation />
          ) : (
            <EventViewNavigation />
          )
        }
        <DashboardHeader />
        <div className="mt-16 relative lg:left-[250px] lg:w-[calc(100%-250px)] md:w-full sm:w-full">
          <div className="h-[90vh] mx-auto relative md:mt-36 sm:mt-36 lg:mt-0">
            {
              checkIfCurrentRouteIsInDashboardRoutes() ? (
                <>
                  <SubHeader />
                  <div className="flex-1 mx-auto px-10 sm:px-0 relative top-20">
                    {children}
                  </div>
                </>
              ) : (
                <div className="flex-1 mx-auto px-8 sm:px-0 relative lg:top-10 md:top-0 sm:top-0 bg-pagePrimary md:flex md:flex-col sm:flex sm:flex-col">
                  {children}
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};
