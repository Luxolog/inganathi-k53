/* Client-side study portal gate. RLS is the actual database security boundary.
   Static GitHub Pages cannot make the HTML source or public assets private. */
(async function(){
 const supabaseClient=window.inganathiSupabase;
 if(!supabaseClient)return;
 const {data:{session}}=await supabaseClient.auth.getSession();
 if(!session){location.replace('login.html?next=manual.html');return;}
 const {data:profile,error}=await supabaseClient.from('profiles')
   .select('role,is_active,access_expires_at')
   .eq('id',session.user.id).maybeSingle();
 const active=profile && profile.role==='learner' && profile.is_active===true &&
   profile.access_expires_at && new Date(profile.access_expires_at)>new Date();
 if(error || !active){
   await supabaseClient.auth.signOut();
   location.replace('login.html?reason=access');
 }
})();
