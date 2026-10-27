import { createFileRoute } from "@tanstack/react-router";
import { getCurrentAdminFn } from "@/services/admin-auth";
import { AdminWorkspace } from "@/components/admin-workspace";
export const Route=createFileRoute("/r/9f2a7c4d6e")({head:()=>({meta:[{title:"Super Admin | Inrishi"},{name:"robots",content:"noindex, nofollow, noarchive"}]}),loader:async()=>getCurrentAdminFn(),component:HiddenAdminPage});
function HiddenAdminPage(){return <AdminWorkspace initial={Route.useLoaderData()}/>;}
