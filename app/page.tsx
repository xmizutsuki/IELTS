"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/storage/db";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    void getProfile().then((profile) => {
      router.replace(profile ? "/dashboard" : "/onboarding");
    });
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-700 text-xl font-bold text-white">
          8
        </div>
        <p className="mt-4 text-sm text-slate-500">Loading your IELTS journey…</p>
      </div>
    </div>
  );
}
