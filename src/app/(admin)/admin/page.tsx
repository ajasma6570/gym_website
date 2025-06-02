import { handleSignOut } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/darkModeToggle";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-3xl space-y-2">
      <p> Admin dashboard </p>
      <div className="flex items-center gap-8">
        <Button onClick={handleSignOut}>sign out</Button>
        <ModeToggle />
      </div>
    </div>
  );
}
