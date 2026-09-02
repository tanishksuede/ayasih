import { SignIn } from "@clerk/clerk-react";

export function SigninPage() {
    return (
        <div className="min-h-screen bg-[#050817] flex items-center justify-center p-4">
            <SignIn path="/signin" routing="path" signUpUrl="/signup" fallbackRedirectUrl="/game" />
        </div>
    );
}
