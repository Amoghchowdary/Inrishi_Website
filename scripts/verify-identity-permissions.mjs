import fs from "node:fs";
const errors=[];const read=p=>fs.readFileSync(p,"utf8");
const auth=read("src/services/admin-auth.ts"),admin=read("src/components/admin-workspace.tsx"),customer=read("src/services/customer-auth.ts"),contract=JSON.parse(read("backend-contract.json"));
for(const action of ["auth.admin.begin","auth.admin.verifyOtp","admin.accounts.create","admin.accounts.permissions","admin.accounts.delete","auth.customer.begin","auth.customer.verifyOtp","auth.customer.registration.request","auth.customer.recovery.request"])if(!contract.actions.includes(action))errors.push(`Backend contract missing identity action: ${action}`);
for(const marker of ["Super Admin","Admin","permissions","deleteAdminAccountFn","issueAdminTemporaryPasswordFn","updateAdminPermissionsFn"])if(!admin.includes(marker)&&!auth.includes(marker))errors.push(`Multi-admin control missing: ${marker}`);
if(!customer.includes("referralCode"))errors.push("Customer registration must accept an optional Partner referral code.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}console.log("V61 identity/permissions gate passed: OTP identities, multi-admin permissions and referral-aware Customer registration are present.");
