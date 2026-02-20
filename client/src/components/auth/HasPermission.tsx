import React from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface HasPermissionProps {
  roles?: string[];
  projectRole?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const HasPermission: React.FC<HasPermissionProps> = ({
  roles,
  projectRole,
  children,
  fallback = null,
}) => {
  const { user } = useAuthStore();

  if (!user) return <>{fallback}</>;

  // Global Role Check
  const hasGlobalRole = roles ? roles.includes(user.role) : true;

  // Note: Project Role check would ideally use a context or a store for the current project
  // For now, we'll focus on Global Role checks for main UI masking.

  if (!hasGlobalRole) return <>{fallback}</>;

  return <>{children}</>;
};
