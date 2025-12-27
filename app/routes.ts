import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("crawler", "routes/crawler.tsx"),
  route("knowledge", "routes/knowledge.tsx"),
  route("subscription", "routes/subscription.tsx"),
  route("chat", "routes/chat.tsx"),
  route("remix", "routes/remix.tsx"),
] satisfies RouteConfig;
