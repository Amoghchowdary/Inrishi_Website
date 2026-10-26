import { execFileSync } from "node:child_process";
import fs from "node:fs";

const repositoryUrl = process.argv[2];
const branch = process.argv[3] || "main";
const commitMessage = process.argv.slice(4).join(" ") || "Deploy Inrishi V39 production frontend";

if (!repositoryUrl) {
  console.error("Usage: npm run push:git -- <repository-url> [branch] [commit message]");
  process.exit(1);
}
if (!fs.existsSync("package.json")) {
  console.error("Run this command from the extracted Inrishi V39 production frontend folder.");
  process.exit(1);
}

function run(command, args, options = {}) {
  console.log(`> ${command} ${args.join(" ")}`);
  return execFileSync(command, args, { stdio: options.capture ? "pipe" : "inherit", encoding: "utf8" });
}

if (!fs.existsSync(".git")) run("git", ["init"]);
run("git", ["branch", "-M", branch]);

let remotes = "";
try { remotes = run("git", ["remote"], { capture: true }); } catch {}
if (remotes.split(/\r?\n/).includes("origin")) run("git", ["remote", "set-url", "origin", repositoryUrl]);
else run("git", ["remote", "add", "origin", repositoryUrl]);

run("git", ["add", "-A"]);
let changes = "";
try { changes = run("git", ["status", "--porcelain"], { capture: true }).trim(); } catch {}
if (changes) run("git", ["commit", "-m", commitMessage]);
else console.log("No new changes to commit.");

run("git", ["push", "-u", "origin", branch]);
console.log("Source pushed. GitHub Actions will run the production checks and deploy the site.");
