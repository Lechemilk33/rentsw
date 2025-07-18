import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("operations", "routes/operations.tsx"),
  route("operations/settings", "routes/operations.settings.tsx"),
  route("admin", "routes/admin.tsx"),
  route("owner", "routes/owner.tsx"),
] satisfies RouteConfig;
