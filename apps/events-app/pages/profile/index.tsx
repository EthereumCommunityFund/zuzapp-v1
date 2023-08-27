import React from 'react'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

type Props = {}

function Profile(props: any) {

    return (
        <div> profiler</div>

    )
}

export default Profile;



export const getServerSideProps = async (ctx: any) => {
    const supabase = createPagesServerClient(ctx)
    let {
        data: { session },
    } = await supabase.auth.getSession()


    if (!session)
        return {
            redirect: {
                destination: '/',
                permanent: false, // or true, depending on your needs
            },
        }






    // get profile from session 
    const { data: profile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('uuid', session.user.id);


    return {
        props: {
            initialSession: session,
            user: session?.user,
            profile: profile
        },
    }



}