import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";

import {
  openSignedZuzaluSignInPopup,
  SignInMessagePayload,
  usePassportPopupMessages,
  useSemaphoreSignatureProof,
  User,
  fetchUser,
  getWithoutProvingUrl,
} from "@pcd/passport-interface";
import {
  PASSPORT_SERVER_URL,
  ZUPASS_SERVER_URL,
  ZUPASS_URL,
} from "../src/constants";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axiosInstance from "../src/axiosInstance";
import { useRouter } from "next/router";

import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd";
import { EdDSAPCDPackage } from "@pcd/eddsa-pcd";

type UserPassportContextData = {
  signIn: any;
  // user: User | null
};

type UserPassportProviderProps = {
  children: ReactNode;
};

export const UserPassportContext = createContext({} as UserPassportContextData);

export function UserPassportContextProvider({
  children,
}: UserPassportProviderProps) {
  const router = useRouter();
  // We only do client-side proofs for Zuzalu UUID proofs, which means we can
  // ignore any PendingPCDs that would result from server-side proving
  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  // console.log(pcdStr, "pcdString")

  const [signatureProofValid, setSignatureProofValid] = useState<
    boolean | undefined
  >();
  // Extract UUID, the signed message of the returned PCD
  const [signedMessage, setSignedMessage] = useState<
    SignInMessagePayload | undefined
  >();

  const onProofVerified = (valid: boolean) => {
    setSignatureProofValid(valid);
  };

  const { signatureProof } = useSemaphoreSignatureProof(
    pcdStr,
    onProofVerified
  );

  useEffect(() => {
    if (signatureProofValid && signatureProof) {
      const signInPayload = JSON.parse(
        signatureProof.claim.signedMessage
      ) as SignInMessagePayload;

      console.log("signInPayload", signInPayload);
      fetchUser(ZUPASS_SERVER_URL, signInPayload.uuid).then((user) => {
        if (user) {
          logInUser(user);
        }
      });
      setSignedMessage(signInPayload);
    }
  }, [signatureProofValid, signatureProof]);

  const signIn = async () => {
    openSignedZuzaluSignInPopup(
      ZUPASS_URL,
      window.location.origin + "/popup",
      "consumer-client"
    );

    // proofUrl = getWithoutProvingUrl(ZUPASS_URL);
    // const proofUrl = getWithoutProvingUrl(
    //   ZUPASS_URL,
    //   `${window.location.origin}/popup`,
    //   EdDSATicketPCDPackage.name
    // );
    // const popupUrl = `/popup?proofUrl=${encodeURIComponent(proofUrl)}`;
    // window.open(popupUrl, "_blank", "width=360,height=480,top=100,popup");

    // let user: User = {
    //   commitment:
    //     "2564230506240300597415797788618650300376657081809946093404919780893081810351",
    //   email: "donwaleyb@gmail.com",
    //   name: "Sly Olawale",
    //   // order_id: "BC7AD",
    //   role: undefined,
    //   uuid: "1cb3ff4f-74ce-4691-8593-aef526124d28",
    //   visitor_date_ranges: [],
    // };
    // logInUser(user);
  };

  // Once we have the UUID, fetch the user data from Passport.
  const logInUser = async (user: User) => {
    let pcdStr = "adfaf";
    console.log("logging in user", user);

    try {
      await axiosInstance.post("/api/auth/authenticate", {
        pcdString: pcdStr,
        ...user,
      });
      router.push("/dashboard/home");
    } catch (error) {
      console.log(error, "new error");
    }
  };

  return (
    <UserPassportContext.Provider value={{ signIn }}>
      {children}
    </UserPassportContext.Provider>
  );
}

export const useUserPassportContext = () => useContext(UserPassportContext);
