import {HomeView} from "@/modules/home/ui/views/home-view"
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
const Page= async ()=>{
  const session =await auth.api.getSession({
    headers: await headers(),
  });//this is the actual desconsturction of the parameter

  if(!session){
    redirect("/sign-in");
  }//we are gonna detext it there is a no session sooner
  return <HomeView/>
}
export default Page;