export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  settings: "/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
