import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPortalSession } from "@/lib/portal/backend";
import { LoginForm } from "./login-form";

export const dynamic="force-dynamic";

export default async function LoginPage(){
  const session=await getPortalSession();
  if(session) redirect("/portal");
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0b1768] p-4"><div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_10%,#ffd35a_0,transparent_28%),radial-gradient(circle_at_90%_85%,#fff_0,transparent_22%)]"/><div className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-white p-7 shadow-[0_32px_90px_rgba(0,0,0,.3)] sm:p-9"><Link href="/" className="mb-8 flex items-center gap-3"><span className="grid size-14 shrink-0 place-items-center overflow-hidden"><Image src="/durotech-logo.png" alt="Durotech Group" width={56} height={56} className="h-full w-full scale-[1.12] object-cover"/></span><div><h1 className="text-xl font-bold text-[#0d1974]">Durotech Group Portal</h1><p className="text-sm text-slate-500">Secure staff access</p></div></Link><LoginForm/><p className="mt-7 text-center text-xs leading-5 text-slate-500">Authorised Durotech staff only. Access and record changes are logged.</p></div></main>;
}

