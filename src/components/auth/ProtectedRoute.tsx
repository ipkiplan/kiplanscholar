import React, { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  setCurrentTab: (tab: string) => void;
}

export default function ProtectedRoute({
  children,
  setCurrentTab,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect once we're sure there's no session — not while it's still loading
    if (!loading && !user) {
      setCurrentTab("login");
    }
  }, [loading, user, setCurrentTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" aria-hidden="true" />
        <span className="ml-2 text-sm text-slate-500">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // We've already triggered the redirect above; render nothing in the meantime
    return null;
  }

  return <>{children}</>;
}