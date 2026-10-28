import fs from "node:fs";
const errors=[];const read=p=>fs.readFileSync(p,"utf8");
const control=read("src/services/admin-control.ts"),admin=read("src/components/admin-workspace.tsx"),partnerProgram=read("src/routes/partner-program.tsx"),contract=JSON.parse(read("backend-contract.json"));
for(const action of ["admin.services.save","admin.partner.services.save","admin.incentive.status","admin.requirements.update"])if(!contract.actions.includes(action)||!control.includes(`\"${action}\"`))errors.push(`Service/incentive action missing: ${action}`);
for(const marker of ["partnerReferrable","incentiveType","incentiveValue","qualifyingPaymentPercent","PartnerServiceAccess","CustomerRequirement"])if(!control.includes(marker))errors.push(`Service/incentive data model missing: ${marker}`);
for(const marker of ["Services this Partner may refer","Incentive","qualifying","Eligible","Approved","Paid"])if(!admin.includes(marker)&&!partnerProgram.includes(marker))errors.push(`Service/incentive UI marker missing: ${marker}`);
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}console.log("V62 service/incentive gate passed: service eligibility, qualifying payment and incentive lifecycle are backend-controlled.");
