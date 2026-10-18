"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm(){
  const router=useRouter();
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setLoading(true);setError("");
    const values=Object.fromEntries(new FormData(event.currentTarget));
    const response=await fetch("/api/portal/auth/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(values)});
    const result=await response.json() as {error?:string};
    if(!response.ok){setError(result.error??"Sign in failed.");setLoading(false);return}
    router.replace("/portal");router.refresh();
  }
  return <form onSubmit={submit} className="space-y-5"><div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" name="email" type="email" autoComplete="email" required placeholder="name@durotech.co.uk" className="h-11 rounded-xl"/></div><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11 rounded-xl"/></div>{error&&<p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}<Button disabled={loading} className="h-11 w-full rounded-xl bg-[#0d1974] text-white hover:bg-[#17258d]">{loading?"Signing in…":"Sign in securely"}</Button></form>;
}

