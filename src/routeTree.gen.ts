/* eslint-disable */
// @ts-nocheck
// Inrishi V81 MAIN strict production route tree.
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as SampleWorkRouteImport } from './routes/sample-work'
import { Route as ServicesRouteImport } from './routes/services'
import { Route as PartnerProgramRouteImport } from './routes/partner-program'
import { Route as AboutInrishiRouteImport } from './routes/about-inrishi'
import { Route as IndustriesRouteImport } from './routes/industries'
import { Route as CustomerLoginRouteImport } from './routes/customer-login'
import { Route as CustomerPortalRouteImport } from './routes/customer-portal'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as ServiceAiBusinessTransformationRouteImport } from './routes/service-ai-business-transformation'
import { Route as ServiceCrmRouteImport } from './routes/service-crm'
import { Route as ServiceEmployeeManagementRouteImport } from './routes/service-employee-management'
import { Route as ServiceWebsiteDesignRouteImport } from './routes/service-website-design'
const IndexRoute=IndexRouteImport.update({id:'/',path:'/',getParentRoute:()=>rootRouteImport} as any)
const ContactRoute=ContactRouteImport.update({id:'/contact',path:'/contact',getParentRoute:()=>rootRouteImport} as any)
const SampleWorkRoute=SampleWorkRouteImport.update({id:'/sample-work',path:'/sample-work',getParentRoute:()=>rootRouteImport} as any)
const ServicesRoute=ServicesRouteImport.update({id:'/services',path:'/services',getParentRoute:()=>rootRouteImport} as any)
const PartnerProgramRoute=PartnerProgramRouteImport.update({id:'/partner-program',path:'/partner-program',getParentRoute:()=>rootRouteImport} as any)
const AboutInrishiRoute=AboutInrishiRouteImport.update({id:'/about-inrishi',path:'/about-inrishi',getParentRoute:()=>rootRouteImport} as any)
const IndustriesRoute=IndustriesRouteImport.update({id:'/industries',path:'/industries',getParentRoute:()=>rootRouteImport} as any)
const CustomerLoginRoute=CustomerLoginRouteImport.update({id:'/customer-login',path:'/customer-login',getParentRoute:()=>rootRouteImport} as any)
const CustomerPortalRoute=CustomerPortalRouteImport.update({id:'/customer-portal',path:'/customer-portal',getParentRoute:()=>rootRouteImport} as any)
const AdminRoute=AdminRouteImport.update({id:'/admin',path:'/admin',getParentRoute:()=>rootRouteImport} as any)
const ServiceAiBusinessTransformationRoute=ServiceAiBusinessTransformationRouteImport.update({id:'/services/ai-business-transformation',path:'/services/ai-business-transformation',getParentRoute:()=>rootRouteImport} as any)
const ServiceCrmRoute=ServiceCrmRouteImport.update({id:'/services/crm',path:'/services/crm',getParentRoute:()=>rootRouteImport} as any)
const ServiceEmployeeManagementRoute=ServiceEmployeeManagementRouteImport.update({id:'/services/employee-management',path:'/services/employee-management',getParentRoute:()=>rootRouteImport} as any)
const ServiceWebsiteDesignRoute=ServiceWebsiteDesignRouteImport.update({id:'/services/website-design',path:'/services/website-design',getParentRoute:()=>rootRouteImport} as any)
export interface FileRoutesByFullPath{'/':typeof IndexRoute;'/contact':typeof ContactRoute;'/sample-work':typeof SampleWorkRoute;'/services':typeof ServicesRoute;'/partner-program':typeof PartnerProgramRoute;'/about-inrishi':typeof AboutInrishiRoute;'/industries':typeof IndustriesRoute;'/customer-login':typeof CustomerLoginRoute;'/customer-portal':typeof CustomerPortalRoute;'/admin':typeof AdminRoute;'/services/ai-business-transformation':typeof ServiceAiBusinessTransformationRoute;'/services/crm':typeof ServiceCrmRoute;'/services/employee-management':typeof ServiceEmployeeManagementRoute;'/services/website-design':typeof ServiceWebsiteDesignRoute}
export interface FileRoutesByTo extends FileRoutesByFullPath{}
export interface FileRoutesById extends FileRoutesByFullPath{__root__:typeof rootRouteImport}
export interface FileRouteTypes{fileRoutesByFullPath:FileRoutesByFullPath;fullPaths:keyof FileRoutesByFullPath;fileRoutesByTo:FileRoutesByTo;to:keyof FileRoutesByTo;id:keyof FileRoutesById;fileRoutesById:FileRoutesById}
export interface RootRouteChildren{IndexRoute:typeof IndexRoute;ContactRoute:typeof ContactRoute;SampleWorkRoute:typeof SampleWorkRoute;ServicesRoute:typeof ServicesRoute;PartnerProgramRoute:typeof PartnerProgramRoute;AboutInrishiRoute:typeof AboutInrishiRoute;IndustriesRoute:typeof IndustriesRoute;CustomerLoginRoute:typeof CustomerLoginRoute;CustomerPortalRoute:typeof CustomerPortalRoute;AdminRoute:typeof AdminRoute;ServiceAiBusinessTransformationRoute:typeof ServiceAiBusinessTransformationRoute;ServiceCrmRoute:typeof ServiceCrmRoute;ServiceEmployeeManagementRoute:typeof ServiceEmployeeManagementRoute;ServiceWebsiteDesignRoute:typeof ServiceWebsiteDesignRoute}
declare module '@tanstack/react-router'{interface FileRoutesByPath{'/':{id:'/';path:'/';fullPath:'/';preLoaderRoute:typeof IndexRouteImport;parentRoute:typeof rootRouteImport};'/contact':{id:'/contact';path:'/contact';fullPath:'/contact';preLoaderRoute:typeof ContactRouteImport;parentRoute:typeof rootRouteImport};'/sample-work':{id:'/sample-work';path:'/sample-work';fullPath:'/sample-work';preLoaderRoute:typeof SampleWorkRouteImport;parentRoute:typeof rootRouteImport};'/services':{id:'/services';path:'/services';fullPath:'/services';preLoaderRoute:typeof ServicesRouteImport;parentRoute:typeof rootRouteImport};'/partner-program':{id:'/partner-program';path:'/partner-program';fullPath:'/partner-program';preLoaderRoute:typeof PartnerProgramRouteImport;parentRoute:typeof rootRouteImport};'/about-inrishi':{id:'/about-inrishi';path:'/about-inrishi';fullPath:'/about-inrishi';preLoaderRoute:typeof AboutInrishiRouteImport;parentRoute:typeof rootRouteImport};'/industries':{id:'/industries';path:'/industries';fullPath:'/industries';preLoaderRoute:typeof IndustriesRouteImport;parentRoute:typeof rootRouteImport};'/customer-login':{id:'/customer-login';path:'/customer-login';fullPath:'/customer-login';preLoaderRoute:typeof CustomerLoginRouteImport;parentRoute:typeof rootRouteImport};'/customer-portal':{id:'/customer-portal';path:'/customer-portal';fullPath:'/customer-portal';preLoaderRoute:typeof CustomerPortalRouteImport;parentRoute:typeof rootRouteImport};'/admin':{id:'/admin';path:'/admin';fullPath:'/admin';preLoaderRoute:typeof AdminRouteImport;parentRoute:typeof rootRouteImport};'/services/ai-business-transformation':{id:'/services/ai-business-transformation';path:'/services/ai-business-transformation';fullPath:'/services/ai-business-transformation';preLoaderRoute:typeof ServiceAiBusinessTransformationRouteImport;parentRoute:typeof rootRouteImport};'/services/crm':{id:'/services/crm';path:'/services/crm';fullPath:'/services/crm';preLoaderRoute:typeof ServiceCrmRouteImport;parentRoute:typeof rootRouteImport};'/services/employee-management':{id:'/services/employee-management';path:'/services/employee-management';fullPath:'/services/employee-management';preLoaderRoute:typeof ServiceEmployeeManagementRouteImport;parentRoute:typeof rootRouteImport};'/services/website-design':{id:'/services/website-design';path:'/services/website-design';fullPath:'/services/website-design';preLoaderRoute:typeof ServiceWebsiteDesignRouteImport;parentRoute:typeof rootRouteImport}}}
const rootRouteChildren:RootRouteChildren={IndexRoute,ContactRoute,SampleWorkRoute,ServicesRoute,PartnerProgramRoute,AboutInrishiRoute,IndustriesRoute,CustomerLoginRoute,CustomerPortalRoute,AdminRoute,ServiceAiBusinessTransformationRoute,ServiceCrmRoute,ServiceEmployeeManagementRoute,ServiceWebsiteDesignRoute}
export const routeTree=rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
