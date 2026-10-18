import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/backend";
import { Portal } from "./portal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session=await getPortalSession();
  if(!session)redirect("/portal/login");
  return <Portal userName={session.currentUser}/>;
}

