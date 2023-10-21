import { fetchAllEventSpaces } from "@/controllers";
import { fetchProfile } from "@/controllers/profile.controllers";
import fetchByEventID from "@/pages/api/invite/fetchByEventID";
import {
  createContext,
  useContext,
  ReactElement,
  useState,
  useEffect,
} from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";

type GlobalContextType = {
  isAuthenticated: boolean;
  user: any;
  profile: any;
  loadProfile: any;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

type GlobalProviderProps = {
  children: ReactElement;
  user: any;
};

export const GlobalProvider = ({ children, user }: GlobalProviderProps) => {
  const isAuthenticated = user ? true : false;

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    fetchProfile().then((res) => {
      setIsLoading(true);
      setProfile(res.data.data);
      setIsLoading(false);
    });
  };

  return (
    <>
      <GlobalContext.Provider
        value={{ isAuthenticated, user, profile, loadProfile }}
      >
        {children}
      </GlobalContext.Provider>
    </>
  );
};

export default GlobalProvider;
