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
      const { data: userData, error: userError } = await supabase.from('profile').select('*').eq('commitment', commitment).single();

      if (userError) {
        throw userError;
      }
      console.log(fakeEmail,'try to signin');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: PASSWORD,
      });
      
      // If the user signs in successfully
      if (data?.user) {
        console.log(data.user,'signed in');
        return res.status(200).send('User signed in');
      }
      
      // throw (signInError)
      if (signInError) {

      const { data: user, error:AuthError } = await supabaseAuth.auth.admin.updateUserById(
        userData.uuid,
        { email: fakeEmail }
      )
      if (AuthError) {
        throw AuthError;
      }
      const { error: updateError } = await supabase
        .from('profile')
        .update({ email:fakeEmail,useraddresses: accounts as string[] })
        .eq('uuid', userData.uuid);

      if (updateError) {
        throw updateError;
      }
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: PASSWORD,
      });
      // If the user signs in successfully
      if (data?.user) {
        return res.status(200).send('User signed in');
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
      }
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}
export default handler;