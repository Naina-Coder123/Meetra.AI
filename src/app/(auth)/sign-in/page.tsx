import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {//if the session already exist this will direct to the root page or home page
    redirect("/");
  }

  return <SignInView />
}
 
export default Page;
// can we put these routes in layout can we protect these but to improve the use experience we should have explicit redirect to protect auth 
//redirect is good for user experience
//do not use as a middleware
//do the direct explicit authentication