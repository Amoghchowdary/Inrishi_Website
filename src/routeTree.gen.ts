/* eslint-disable */
// @ts-nocheck
// Generated route tree for Inrishi V52 production routes.

import { Route as rootRouteImport } from './routes/__root'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as SampleWorkRouteImport } from './routes/sample-work'
import { Route as IndexRouteImport } from './routes/index'
import { Route as CustomerLoginRouteImport } from './routes/customer-login'
import { Route as CustomerPortalRouteImport } from './routes/customer-portal'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as R9f2a7c4d6eRouteImport } from './routes/r.9f2a7c4d6e'
import { Route as PartnerRouteImport } from './routes/partner'
import { Route as PartnerRegisterRouteImport } from './routes/partner-register'
import { Route as PartnerLoginRouteImport } from './routes/partner-login'
import { Route as PartnerPortalRouteImport } from './routes/partner-portal'
import { Route as LoginRouteImport } from './routes/login'
import { Route as RegisterRouteImport } from './routes/register'
import { Route as PortalRouteImport } from './routes/portal'

const ContactRoute = ContactRouteImport.update({ id:'/contact', path:'/contact', getParentRoute:()=>rootRouteImport } as any)
const SampleWorkRoute = SampleWorkRouteImport.update({ id:'/sample-work', path:'/sample-work', getParentRoute:()=>rootRouteImport } as any)
const CustomerLoginRoute = CustomerLoginRouteImport.update({ id:'/customer-login', path:'/customer-login', getParentRoute:()=>rootRouteImport } as any)
const CustomerPortalRoute = CustomerPortalRouteImport.update({ id:'/customer-portal', path:'/customer-portal', getParentRoute:()=>rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id:'/admin', path:'/admin', getParentRoute:()=>rootRouteImport } as any)
const R9f2a7c4d6eRoute = R9f2a7c4d6eRouteImport.update({ id:'/r/9f2a7c4d6e', path:'/r/9f2a7c4d6e', getParentRoute:()=>rootRouteImport } as any)
const PartnerRoute = PartnerRouteImport.update({ id:'/partner', path:'/partner', getParentRoute:()=>rootRouteImport } as any)
const PartnerRegisterRoute = PartnerRegisterRouteImport.update({ id:'/partner-register', path:'/partner-register', getParentRoute:()=>rootRouteImport } as any)
const PartnerLoginRoute = PartnerLoginRouteImport.update({ id:'/partner-login', path:'/partner-login', getParentRoute:()=>rootRouteImport } as any)
const PartnerPortalRoute = PartnerPortalRouteImport.update({ id:'/partner-portal', path:'/partner-portal', getParentRoute:()=>rootRouteImport } as any)
const LoginRoute = LoginRouteImport.update({ id:'/login', path:'/login', getParentRoute:()=>rootRouteImport } as any)
const RegisterRoute = RegisterRouteImport.update({ id:'/register', path:'/register', getParentRoute:()=>rootRouteImport } as any)
const PortalRoute = PortalRouteImport.update({ id:'/portal', path:'/portal', getParentRoute:()=>rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id:'/', path:'/', getParentRoute:()=>rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute; '/contact': typeof ContactRoute; '/sample-work': typeof SampleWorkRoute;
  '/customer-login': typeof CustomerLoginRoute; '/customer-portal': typeof CustomerPortalRoute; '/admin': typeof AdminRoute; '/r/9f2a7c4d6e': typeof R9f2a7c4d6eRoute;
  '/partner': typeof PartnerRoute; '/partner-register': typeof PartnerRegisterRoute; '/partner-login': typeof PartnerLoginRoute; '/partner-portal': typeof PartnerPortalRoute;
  '/login': typeof LoginRoute; '/register': typeof RegisterRoute; '/portal': typeof PortalRoute;
}
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById extends FileRoutesByFullPath { __root__: typeof rootRouteImport }
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: keyof FileRoutesByFullPath
  fileRoutesByTo: FileRoutesByTo
  to: keyof FileRoutesByTo
  id: keyof FileRoutesById
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute; ContactRoute: typeof ContactRoute; SampleWorkRoute: typeof SampleWorkRoute;
  CustomerLoginRoute: typeof CustomerLoginRoute; CustomerPortalRoute: typeof CustomerPortalRoute; AdminRoute: typeof AdminRoute; R9f2a7c4d6eRoute: typeof R9f2a7c4d6eRoute;
  PartnerRoute: typeof PartnerRoute; PartnerRegisterRoute: typeof PartnerRegisterRoute; PartnerLoginRoute: typeof PartnerLoginRoute; PartnerPortalRoute: typeof PartnerPortalRoute;
  LoginRoute: typeof LoginRoute; RegisterRoute: typeof RegisterRoute; PortalRoute: typeof PortalRoute;
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/contact': { id:'/contact'; path:'/contact'; fullPath:'/contact'; preLoaderRoute:typeof ContactRouteImport; parentRoute:typeof rootRouteImport }
    '/': { id:'/'; path:'/'; fullPath:'/'; preLoaderRoute:typeof IndexRouteImport; parentRoute:typeof rootRouteImport }
    '/sample-work': { id:'/sample-work'; path:'/sample-work'; fullPath:'/sample-work'; preLoaderRoute:typeof SampleWorkRouteImport; parentRoute:typeof rootRouteImport }
    '/customer-login': { id:'/customer-login'; path:'/customer-login'; fullPath:'/customer-login'; preLoaderRoute:typeof CustomerLoginRouteImport; parentRoute:typeof rootRouteImport }
    '/customer-portal': { id:'/customer-portal'; path:'/customer-portal'; fullPath:'/customer-portal'; preLoaderRoute:typeof CustomerPortalRouteImport; parentRoute:typeof rootRouteImport }
    '/admin': { id:'/admin'; path:'/admin'; fullPath:'/admin'; preLoaderRoute:typeof AdminRouteImport; parentRoute:typeof rootRouteImport }
    '/r/9f2a7c4d6e': { id:'/r/9f2a7c4d6e'; path:'/r/9f2a7c4d6e'; fullPath:'/r/9f2a7c4d6e'; preLoaderRoute:typeof R9f2a7c4d6eRouteImport; parentRoute:typeof rootRouteImport }
    '/partner': { id:'/partner'; path:'/partner'; fullPath:'/partner'; preLoaderRoute:typeof PartnerRouteImport; parentRoute:typeof rootRouteImport }
    '/partner-register': { id:'/partner-register'; path:'/partner-register'; fullPath:'/partner-register'; preLoaderRoute:typeof PartnerRegisterRouteImport; parentRoute:typeof rootRouteImport }
    '/partner-login': { id:'/partner-login'; path:'/partner-login'; fullPath:'/partner-login'; preLoaderRoute:typeof PartnerLoginRouteImport; parentRoute:typeof rootRouteImport }
    '/partner-portal': { id:'/partner-portal'; path:'/partner-portal'; fullPath:'/partner-portal'; preLoaderRoute:typeof PartnerPortalRouteImport; parentRoute:typeof rootRouteImport }
    '/login': { id:'/login'; path:'/login'; fullPath:'/login'; preLoaderRoute:typeof LoginRouteImport; parentRoute:typeof rootRouteImport }
    '/register': { id:'/register'; path:'/register'; fullPath:'/register'; preLoaderRoute:typeof RegisterRouteImport; parentRoute:typeof rootRouteImport }
    '/portal': { id:'/portal'; path:'/portal'; fullPath:'/portal'; preLoaderRoute:typeof PortalRouteImport; parentRoute:typeof rootRouteImport }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute, ContactRoute, SampleWorkRoute, CustomerLoginRoute, CustomerPortalRoute, AdminRoute, R9f2a7c4d6eRoute,
  PartnerRoute, PartnerRegisterRoute, PartnerLoginRoute, PartnerPortalRoute, LoginRoute, RegisterRoute, PortalRoute,
}
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
