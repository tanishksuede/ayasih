import { SignUp } from "@clerk/clerk-react";

export function SignupPage() {
    return (
        <div className="min-h-screen bg-[#050817] flex items-center justify-center p-4">
            <SignUp path="/signup" routing="path" signInUrl="/signin" fallbackRedirectUrl="/game" />
        </div>
    );
}
