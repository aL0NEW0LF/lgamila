import { useLocation, useNavigate } from "react-router";
import authClient from "../auth";
import { useEffect } from "react";

const useAuthGuard = (redirectTo?: string) => {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const currentPath = useLocation().pathname;

  useEffect(() => {
    if (!session?.user && !isPending) {
      navigate(`/auth/login?redirectTo=${redirectTo ?? currentPath}`);
    }
  }, [session?.user, navigate, redirectTo, isPending, currentPath]);
};

export const AuthGuard = ({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  useAuthGuard(redirectTo);
  return <>{children}</>;
};
