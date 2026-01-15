import fs from "fs";
import path from "path";

const resultsDir = "allure-results";
const reportDir = "allure-report";

// Ensure allure-results exists
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

// ✅ 1. Copy history for trends
const historySrc = path.join(reportDir, "history");
const historyDest = path.join(resultsDir, "history");

if (fs.existsSync(historySrc)) {
    fs.cpSync(historySrc, historyDest, { recursive: true });
    console.log("✔ History copied for trend charts");
}

// ✅ 2. Create environment.properties
const envFile = path.join(resultsDir, "environment.properties");
fs.writeFileSync(
    envFile,
    `Browser=Chrome\nOS=${process.platform}\nBaseURL=https://staging.dev-tpac.xyz`
);
console.log("✔ environment.properties created");

// ✅ 3. Create executor.json
const executorFile = path.join(resultsDir, "executor.json");
const executorData = {
    name: "Local Run",
    type: "local",
    buildName: `Run #${Date.now()}`,
    reportName: "Playwright Allure Report",
    reportUrl: "http://localhost:8080/allure-report"
};
fs.writeFileSync(executorFile, JSON.stringify(executorData, null, 2));
console.log("✔ executor.json created");
