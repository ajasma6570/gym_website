"use client";

import { LoginForm } from "@/components/admin/LoginForm";
import { ModeToggle } from "@/components/ui/darkModeToggle";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="bg-muted relative hidden lg:block">
        <Image
          fill
          loading="lazy"
          src={"/assets/cross-training-rope-swing-exercise.jpg"}
          alt="Login page background"
          className="absolute inset-0 h-full w-full object-cover "
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex  gap-2 justify-between items-center">
          <a href="#" className="flex text-2xl font-bold items-center gap-2 ">
            Logo
          </a>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm border p-6 py-10 rounded-lg ">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
