import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getSiteBasePath } from "@/lib/site-path";

export const getRouter = () => {
  const queryClient = new QueryClient();
  return createRouter({
    routeTree,
    basepath: getSiteBasePath() || "/",
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
};
