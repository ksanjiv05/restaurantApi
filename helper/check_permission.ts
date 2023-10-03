import roles from "../config/roles";

export const hasPermission = (
  role: string,
  access_type: string,
  action: string
) => {
  const roleObj: any = roles.find((r) => r.name === role);
  if (!roleObj) return false;
  const permission_access = roleObj.permissions[access_type];
  if (!permission_access) return false;
  return permission_access.includes(action);
};
