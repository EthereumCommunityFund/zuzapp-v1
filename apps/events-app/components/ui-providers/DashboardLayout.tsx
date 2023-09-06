import { useRouter } from "next/router"
import DashboardNavigation from "../navigation/Dashboard"
import DashboardHeader from "../navigation/Header"
import { dashboardRoutes } from "../navigation/Dashboard/routes"
import SubHeader from "../navigation/Header/SubHeader"

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()

    const checkIfCurrentRouteIsInDashboardRoutes = () => {
      const routes = dashboardRoutes;
      const currentRoute = routes.find(route => route.path === router.pathname);
      if (currentRoute) return true;
      return false;
    }

    if (!router.pathname.startsWith("/dashboard")) return <div className="bg-[#222222] text-white relative min-h-screen">{children}</div>
    return (
        <>
        <div className="flex relative bg-[#222222] text-white">
          <DashboardNavigation />
            <DashboardHeader />
          <div className="mt-20 w-full overflow-y-auto h-[90vh]">
            {
              !checkIfCurrentRouteIsInDashboardRoutes() && (
                  <SubHeader />
                  )
                }
            <div className="flex-1 mx-auto mt-10 px-10 gap-2.5">
              {children}
            </div>
          </div>
        </div>
      </>
    )
}