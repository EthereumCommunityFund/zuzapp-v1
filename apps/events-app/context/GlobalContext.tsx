import { fetchAllEventSpaces } from "@/controllers";
import { fetchProfile } from "@/controllers/profile.controllers";
import fetchByEventID from "@/pages/api/invite/fetchByEventID";
import { createContext, useContext, ReactElement, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";

type GlobalContextType = {
  isAuthenticated: boolean;
  user: any;
  profile: any;
  setProfile: any;
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
  //   const isAuthenticated = user ? true : false;/
  const { data, isLoading, isError } = useQuery("profile", fetchProfile, {
    staleTime: 0,
  });
  const [refreshState, setRefreshState] = useState(false);

  const queryClient = useQueryClient();

  const setProfile = async () => {
    setRefreshState(!refreshState);
    queryClient.invalidateQueries("profile");
    await queryClient.refetchQueries("profile");
  };

  console.log("profile", data);

  let profile;
  if (data?.data) {
    profile = data.data.data;
  }
  return (
    <>
      <GlobalContext.Provider
        value={{ isAuthenticated, user, profile, setProfile }}
      >
        {children}
      </GlobalContext.Provider>
    </>
  );
};

export default GlobalProvider;
