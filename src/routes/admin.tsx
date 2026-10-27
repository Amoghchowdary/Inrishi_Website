import { createFileRoute } from "@tanstack/react-router";
import { getCurrentAdminFn } from "@/services/admin-auth";
import { AdminWorkspace } from "@/components/admin-workspace";
export const Route=createFileRoute("/admin")({head:()=>({meta:[{title:"Super Admin | Inrishi"},{name:"robots",content:"noindex, nofollow, noarchive"}]}),loader:async()=>getCurrentAdminFn(),component:AdminPage});
function AdminPage(){return <AdminWorkspace initial={Route.useLoaderData()}/>;}
