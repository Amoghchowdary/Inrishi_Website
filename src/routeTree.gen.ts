/* eslint-disable */
// @ts-nocheck
// Generated route tree for Inrishi V53 MAIN production routes.
import { Route as rootRouteImport } from './routes/__root'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as SampleWorkRouteImport } from './routes/sample-work'
import { Route as IndexRouteImport } from './routes/index'
import { Route as CustomerLoginRouteImport } from './routes/customer-login'
import { Route as CustomerPortalRouteImport } from './routes/customer-portal'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as R9f2a7c4d6eRouteImport } from './routes/r.9f2a7c4d6e'
const ContactRoute=ContactRouteImport.update({id:'/contact',path:'/contact',getParentRoute:()=>rootRouteImport} as any)
const SampleWorkRoute=SampleWorkRouteImport.update({id:'/sample-work',path:'/sample-work',getParentRoute:()=>rootRouteImport} as any)
const CustomerLoginRoute=CustomerLoginRouteImport.update({id:'/customer-login',path:'/customer-login',getParentRoute:()=>rootRouteImport} as any)
const CustomerPortalRoute=CustomerPortalRouteImport.update({id:'/customer-portal',path:'/customer-portal',getParentRoute:()=>rootRouteImport} as any)
const AdminRoute=AdminRouteImport.update({id:'/admin',path:'/admin',getParentRoute:()=>rootRouteImport} as any)
const R9f2a7c4d6eRoute=R9f2a7c4d6eRouteImport.update({id:'/r/9f2a7c4d6e',path:'/r/9f2a7c4d6e',getParentRoute:()=>rootRouteImport} as any)
const IndexRoute=IndexRouteImport.update({id:'/',path:'/',getParentRoute:()=>rootRouteImport} as any)
export interface FileRoutesByFullPath{'/':typeof IndexRoute;'/contact':typeof ContactRoute;'/sample-work':typeof SampleWorkRoute;'/customer-login':typeof CustomerLoginRoute;'/customer-portal':typeof CustomerPortalRoute;'/admin':typeof AdminRoute;'/r/9f2a7c4d6e':typeof R9f2a7c4d6eRoute}
export interface FileRoutesByTo extends FileRoutesByFullPath{}
export interface FileRoutesById extends FileRoutesByFullPath{__root__:typeof rootRouteImport}
export interface FileRouteTypes{fileRoutesByFullPath:FileRoutesByFullPath;fullPaths:keyof FileRoutesByFullPath;fileRoutesByTo:FileRoutesByTo;to:keyof FileRoutesByTo;id:keyof FileRoutesById;fileRoutesById:FileRoutesById}
export interface RootRouteChildren{IndexRoute:typeof IndexRoute;ContactRoute:typeof ContactRoute;SampleWorkRoute:typeof SampleWorkRoute;CustomerLoginRoute:typeof CustomerLoginRoute;CustomerPortalRoute:typeof CustomerPortalRoute;AdminRoute:typeof AdminRoute;R9f2a7c4d6eRoute:typeof R9f2a7c4d6eRoute}
declare module '@tanstack/react-router'{interface FileRoutesByPath{'/':{id:'/';path:'/';fullPath:'/';preLoaderRoute:typeof IndexRouteImport;parentRoute:typeof rootRouteImport};'/contact':{id:'/contact';path:'/contact';fullPath:'/contact';preLoaderRoute:typeof ContactRouteImport;parentRoute:typeof rootRouteImport};'/sample-work':{id:'/sample-work';path:'/sample-work';fullPath:'/sample-work';preLoaderRoute:typeof SampleWorkRouteImport;parentRoute:typeof rootRouteImport};'/customer-login':{id:'/customer-login';path:'/customer-login';fullPath:'/customer-login';preLoaderRoute:typeof CustomerLoginRouteImport;parentRoute:typeof rootRouteImport};'/customer-portal':{id:'/customer-portal';path:'/customer-portal';fullPath:'/customer-portal';preLoaderRoute:typeof CustomerPortalRouteImport;parentRoute:typeof rootRouteImport};'/admin':{id:'/admin';path:'/admin';fullPath:'/admin';preLoaderRoute:typeof AdminRouteImport;parentRoute:typeof rootRouteImport};'/r/9f2a7c4d6e':{id:'/r/9f2a7c4d6e';path:'/r/9f2a7c4d6e';fullPath:'/r/9f2a7c4d6e';preLoaderRoute:typeof R9f2a7c4d6eRouteImport;parentRoute:typeof rootRouteImport}}}
const rootRouteChildren:RootRouteChildren={IndexRoute,ContactRoute,SampleWorkRoute,CustomerLoginRoute,CustomerPortalRoute,AdminRoute,R9f2a7c4d6eRoute}
export const routeTree=rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
