import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { createClient } from '@supabase/supabase-js'
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient<Database>({ req, res });
    const supabaseAuth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE as string, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
  const PASSWORD = process.env.SUPABASE_USER_PASS as string;

  const accounts = req.body.accounts;
  let account = '';
  let fakeEmail = '';

  if (accounts) {
    account = accounts[0];
    fakeEmail = `${account}@gmail.com`;
  }

  const commitment = req.body.commitment;

  if (commitment) {
    try {
      const { data: usermergedData, error: usermergedError } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('commitment',commitment)
                    .contains('useraddresses', [account])
                    .maybeSingle();
                
                if (usermergedData) {
             
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                        email: fakeEmail,
                        password: PASSWORD
                    });
            
                    // If the user signs in successfully
                if (data?.user) {
                        return res.status(200).send("User signed in");
                    }
                    // throw (signInError)
                if (signInError) {
                const { data: user, error:AuthError } = await supabaseAuth.auth.admin.updateUserById(
                    usermergedData.uuid,
                    { email: fakeEmail }
                  )
                if (AuthError) {
                    throw AuthError;
                }
                
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: fakeEmail,
                    password: PASSWORD
                });
                // If the user signs in successfully
                if (data?.user) {
                    return res.status(200).send("User signed in");
                }}}
                else{
                const { data: userzupassData, error: userzupassError } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('commitment',commitment)
                    .single();
                if(userzupassError){
                    throw userzupassError
                }
                //search the wallet account
                const { data: userwalletData, error: userwalletError } = await supabase
                    .from('profile')
                    .select('*')
                    .contains('useraddresses', [account])
                    .maybeSingle();

                    if(userwalletError){
                        throw userwalletError
                    }
                if(userwalletData){

                //now we need to delete the wallet account
                const { error: updateEventspaceError } = await supabase
                .from('eventspace')
                .update({creator_id:userzupassData.uuid})
                .eq('creator_id', userwalletData.uuid);
                    
                if(updateEventspaceError){
                    throw updateEventspaceError
                }
                const { error: updateInviteeError } = await supabase
                        .from('eventspaceinvites')
                        .update({ invitee_id: userzupassData.uuid })
                        .eq('invitee_id', userwalletData.uuid);
                if(updateInviteeError){
                    throw updateInviteeError
                    }

                const { error: updateInviterError } = await supabase
                    .from('eventspaceinvites')
                    .update({ inviter_id: userzupassData.uuid })
                    .eq('inviter_id', userwalletData.uuid);
                    
                if(updateInviterError){
                        throw updateInviterError
                }

                const { error: editlogsError } = await supabase
                .from('editlogs')
                .update({editor_id:userzupassData.uuid})
                .eq('editor_id', userwalletData.uuid);
                    
                if(editlogsError){
                    throw editlogsError
                }

                const { error: userrsvpError } = await supabase
                .from('userrsvp')
                .update({user_id:userzupassData.uuid})
                .eq('user_id', userwalletData.uuid);
                    
                if(userrsvpError){
                    throw userrsvpError
                }
                //delete wallet account
                const { error: deleteError } = await supabase
                .from('profile')
                .delete()
                .eq('uuid', userwalletData.uuid);

                if(deleteError){
                    throw deleteError
                }
                const { data: user, error:AuthdeleteError } = await supabaseAuth.auth.admin.deleteUser(
                    userwalletData.uuid,
                  )

                  if(AuthdeleteError){
                    throw AuthdeleteError
                }
                //merge data
                const { data:searchdata, error } = await supabase
                        .from('profile')
                        .select('*')
                        .eq('uuid', userzupassData.uuid)
                        .single()

                    if (error) {
                        throw error
                    }
                    if(searchdata){
                      if(searchdata.useraddresses){
                        const updatedAddresses = searchdata.useraddresses.concat(accounts);

                        const { error: updateError } = await supabase
                            .from('profile')
                            .update({ useraddresses: updatedAddresses })
                            .eq('uuid', userzupassData.uuid);

                        if (updateError) {
                           throw updateError
                        }
                    }else{
                      const {error } = await supabase
                      .from('profile')
                      .update({useraddresses:accounts})
                      .eq('uuid', userzupassData.uuid)

                      if (error) {
                        throw error
                     }
                    }}
                    //data merged, now try to sign in
                    const { data, error: signInError } = await supabase.auth.signInWithPassword({
                        email:fakeEmail,
                        password: PASSWORD
                    });
                    // If the user signs in successfully
                    if (data?.user) {
                        return res.status(200).send("User signed in");
                    }
                }else{
                //since no previous wallet account, merge info to zupass account
                const { data:searchdata, error } = await supabase
                .from('profile')
                .select('useraddresses')
                .eq('uuid', userzupassData.uuid)
                .maybeSingle()

            if (error) {
                throw error
            }
            if(searchdata){
              if(searchdata.useraddresses){
                const updatedAddresses = searchdata.useraddresses.concat(accounts);

                const { error: updateError } = await supabase
                    .from('profile')
                    .update({ useraddresses: updatedAddresses })
                    .eq('uuid', userzupassData.uuid);

                if (updateError) {
                   throw updateError
                }
            }else{
              const {error } = await supabase
              .from('profile')
              .update({useraddresses:accounts})
              .eq('uuid', userzupassData.uuid)

              if (error) {
                throw error
             }
            }}
                //change the auth email then sign in
                const { data: user, error:AuthError } = await supabaseAuth.auth.admin.updateUserById(
                    userzupassData.uuid,
                    { email: fakeEmail }
                  )
                if (AuthError) {
                    throw AuthError;
                }
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email:fakeEmail,
                    password: PASSWORD
                })
                // If the user signs in successfully
                if (signInError) {
                    throw signInError;
                }
                if (data?.user) {
                    return res.status(200).send("User signed in");
                }
            }
        
    }
    } catch (error) {
      res.status(500).send('Internal server error ');
    }
  } else {
    try {
      console.log(fakeEmail, 'fakeemail');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: PASSWORD,
      });
      // If the user signs in successfully
      if (data?.user) {
        return res.status(200).send('User signed in');
      }

      // throw (signInError)
      if (signInError) {
        console.error('Error during signIn:', signInError.message);
        console.error("Error during signIn:", signInError.message);
        //search if there is merged data
        /*const { data: usermergedData, error: usermergedError } = await supabase
        .from('profile')
        .select('*')
        .not('commitment','is', null)
        .contains('useraddresses', accounts)
        .maybeSingle()*/

        let filterString = accounts.map((account: string) => `useraddresses.cs.{"${account}"}`).join(',');

        const { data: usermergedData, error: usermergedError } = await supabase
            .from('profile')
            .select('*')
            .not('commitment', 'is', null)
            .or(filterString)
            .maybeSingle();

    
    if(usermergedData){
    const { data: user, error:AuthError } = await supabaseAuth.auth.admin.updateUserById(
        usermergedData.uuid,
        { email: fakeEmail }
      )
    if (AuthError) {
        throw AuthError;
    }
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email:fakeEmail,
        password: PASSWORD
    });
    // If the user signs in successfully
    if (data?.user) {
        return res.status(200).send("User signed in");
    }
    }
    else{
        // Attempt to sign up if the error indicates the user does not exist
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: fakeEmail,
          password: PASSWORD,
        });

        // console.log(data, "signup data");

        // // If the user signs up successfully

        if (signUpData.user) {
          const { error: updateError } = await supabase
            .from('profile')
            .update({
              email: fakeEmail,
              useraddresses: accounts,
            })
            .eq('uuid', signUpData.user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError.message);
            return res.status(500).send('updateError.message');
          }

          return res.status(200).send('User signed up and profile updated');
        }

        // // If there was an error during sign up
        if (signUpError) {
          // console.error("Error during signup:", signUpError.message);
          // throw new Error("Failed to sign up after sign-in error.");
          return res.status(signUpError.status as number).send(signUpError.message);
        }
      }}
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}
export default handler;
