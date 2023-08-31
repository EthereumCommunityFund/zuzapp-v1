
import { createContext, ReactNode, useState, useContext, useEffect } from "react"



import {
    openSignedZuzaluSignInPopup,
    SignInMessagePayload,
    usePassportPopupMessages,
    useSemaphoreSignatureProof,
    User,
    fetchUser
} from "@pcd/passport-interface";
import { ZUPASS_SERVER_URL, ZUPASS_URL } from "../src/constants";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axiosInstance from "../src/axiosInstance";
import { useRouter } from "next/router";


type UserPassportContextData = {
    signIn: any;
    // user: User | null
}

type UserPassportProviderProps = {
    children: ReactNode
}

export const UserPassportContext = createContext({} as UserPassportContextData)

export function UserPassportContextProvider({ children }: UserPassportProviderProps) {
    const supabase = useSupabaseClient()
    const router = useRouter()

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

            console.log('signInPayload', signInPayload)
            fetchUser(ZUPASS_SERVER_URL, signInPayload.uuid).then(user => {
                if (user) {
                    logInUser(user)
                }
            })
            setSignedMessage(signInPayload)
        }
    }, [signatureProofValid, signatureProof]);



    const signIn = async () => {
        openSignedZuzaluSignInPopup(
            ZUPASS_URL,
            window.location.origin + "/popup",
            "consumer-client"
        )


    }

    // Once we have the UUID, fetch the user data from Passport.
    const logInUser = async (user: User) => {
        console.log('logging in user', user)

        try {
            await axiosInstance.post('/api/auth/authenticate', {
                pcdString: pcdStr,
                ...user
            })
            router.push("/")
        } catch (error) {
            console.log(error, "new error")
        }


    }

    return (
        <UserPassportContext.Provider value={{ signIn }}>
            {children}
        </UserPassportContext.Provider>
    )
}

export const useUserPassportContext = () => useContext(UserPassportContext)
