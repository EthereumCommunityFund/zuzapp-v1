import Button from "@/components/ui/buttons/Button";
import { eventViewRoutes } from "@/constant/routes";
import { useGlobalContext } from "@/context/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCog } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

export default function EventViewNavigation() {
    const router = useRouter();
    const routes = eventViewRoutes;
    const { isAuthenticated, user } = useGlobalContext();
    return (
        <div className="flex flex-col min-w-[280px] py-10 px-8 gap-6">
            <Button leftIcon={HiArrowLeft}>Back to Events</Button>
            <nav
                className={`dashboard-menu  fixed flex flex-col h-screen border-r border-r-gray-800 bg-[#2F3232] py-10 px-8 transition-transform duration-300`}
            >
                <h3>Navigate Event</h3>
                <div className="flex-1 flex flex-col opacity-70">
                    <div className="mt-10 flex-1">
                        <ul className="space-y-2">
                            {routes.map((route, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center space-x-2 py-1 px-3 hover:bg-white/20 rounded-3xl ${router.pathname === route.path && "bg-white/20"
                                        }`}
                                >
                                    {route.icon && <route.icon size={30} />}
                                    <Link href={route.path} className="w-full ">
                                        {route.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}