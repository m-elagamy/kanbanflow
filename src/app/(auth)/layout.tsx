import { GoogleOneTap } from "@clerk/nextjs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleOneTap
        signInForceRedirectUrl="/welcome"
        signUpForceRedirectUrl="/welcome"
      />
      {children}
    </>
  );
}
