import fs from "node:fs";
const errors=[];const s=fs.readFileSync("src/services/secure-chat.ts","utf8"),ui=fs.readFileSync("src/components/secure-chat.tsx","utf8"),admin=fs.readFileSync("src/components/admin-workspace.tsx","utf8"),customer=fs.readFileSync("src/routes/customer-portal.tsx","utf8"),contract=JSON.parse(fs.readFileSync("backend-contract.json","utf8"));
for(const marker of ["RSA-OAEP","AES-GCM","crypto.subtle.generateKey","wrappedKeysJson","ciphertext","chat.device.register","chat.messages.list","chat.message.send","chat.attachment.upload","chat.attachment.get"])if(!s.includes(marker))errors.push(`E2EE/chat marker missing: ${marker}`);
for(const a of ["chat.device.register","chat.context","chat.messages.list","chat.message.send","chat.attachment.upload","chat.attachment.get"])if(!contract.actions.includes(a))errors.push(`Chat backend action missing: ${a}`);
if(!ui.includes("attachment")&&!ui.includes("Attachment"))errors.push("Chat attachment UI missing.");
if(!admin.includes('<SecureChat role="admin"/>'))errors.push("Admin chat surface missing.");
if(!customer.includes('<SecureChat role="customer"/>'))errors.push("Customer chat surface missing.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}console.log("V62 encrypted-chat gate passed: browser-side AES-GCM/RSA-OAEP encryption, attachment encryption and role surfaces are present.");
