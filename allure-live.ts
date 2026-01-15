import { exec } from "child_process";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";

const RESULTS_DIR = path.join(__dirname, "allure-results");
const REPORT_DIR = path.join(__dirname, "allure-report");
const TEMP_DIR = path.join(__dirname, "allure-report-temp");

// Run shell command as promise
const runCommand = (cmd: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const child = exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                reject(error);
                return;
            }
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            resolve();
        });

        if (child.stdout) child.stdout.pipe(process.stdout);
        if (child.stderr) child.stderr.pipe(process.stderr);
    });
};

// Generate Allure Report
const generateReport = async () => {
    console.log("⚡ Generating Allure Report...");
    try {
        await runCommand(
            `allure generate ${RESULTS_DIR} --clean -o ${REPORT_DIR}`
        );
        console.log("✅ Allure report generated!");
    } catch (err) {
        console.error("❌ Failed to generate report", err);
    }
};

// Serve the Allure Report
const serveReport = async () => {
    console.log("🚀 Starting Allure report server...");
    await runCommand(`npx serve ${REPORT_DIR} -l 5000`);
};

// Watch for changes in results folder
const watchResults = () => {
    console.log("👀 Watching for new results...");
    chokidar.watch(RESULTS_DIR, { ignoreInitial: true }).on("all", () => {
        generateReport();
    });
};

// Main
(async () => {
    await generateReport();
    watchResults();
    await serveReport();
})();