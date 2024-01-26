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
  let isAuthenticated = user ? true : false;
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
      isAuthenticated =true;
    }
  }, [isAuthenticated]);
  const loadProfile = async () => {
    try{fetchProfile().then((res) => {
      setIsLoading(true);
      setProfile(res.data.data);
      setIsLoading(false);
    });}
    catch(error){console.log(error,'error fetching');}
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
