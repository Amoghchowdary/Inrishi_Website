import fs from "node:fs";
const errors=[];
const admin=fs.readFileSync("src/components/admin-workspace.tsx","utf8");
const adminService=fs.readFileSync("src/services/admin-control.ts","utf8");
const customer=fs.readFileSync("src/routes/customer-portal.tsx","utf8");
for(const marker of ["Dashboard","Website","Website inquiries","Customers","Partners","Projects","Security","Production data is unavailable","No website inquiries","No customers","No partners","No projects"]) if(!admin.includes(marker)) errors.push(`Admin module/empty-state missing: ${marker}`);
for(const action of ["admin.control.snapshot","admin.partner.status","admin.customer.status","admin.project.progress","admin.controls.save"]) if(!adminService.includes(action)) errors.push(`Admin service action missing: ${action}`);
if(!customer.includes("getCustomerPortalSnapshotFn")) errors.push("Customer portal must load production-scoped data directly from Apps Script.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V59 Main portal workflow verification passed: Admin modules/data writes and Customer production snapshot are present.");
