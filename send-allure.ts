// ...existing code...
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1️⃣ Configure transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "Shivangisaraswat1@gmail.com", // hardcoded for email paswords
        pass: "yveu zrai mxpf gmxs", //gmail app pasword
    },
});


function inlineCss(html: string, reportDir: string) {
    return html.replace(/<link[^>]*href="([^"]+)"[^>]*>/gi, (_m, href) => {
        try {
            const cssPath = path.resolve(reportDir, href);
            const css = fs.readFileSync(cssPath, "utf8");
            return `<style>\n${css}\n</style>`;
        } catch {
            return ""; // drop if not found
        }
    });
}

function embedImages(html: string, reportDir: string, attachments: any[]) {
    let cidIndex = 0;
    return html.replace(/(<img[^>]*src=")(?!cid:|https?:|data:)([^"]+)(")/gi, (m, pre, src, post) => {
        const imgPath = path.resolve(reportDir, src);
        if (!fs.existsSync(imgPath)) return m;
        const cid = `report-img-${cidIndex++}@playwright`;
        attachments.push({
            filename: path.basename(imgPath),
            path: imgPath,
            cid,
        });
        return `${pre}cid:${cid}${post}`;
    });
}


(async () => {
    const reportDir = path.join(__dirname, "allure-report");
    const indexHtmlPath = path.join(reportDir, "index.html");

    if (!fs.existsSync(indexHtmlPath)) {
        console.error("❌ index.html not found at", indexHtmlPath);
        process.exit(1);
    }

    // read and transform HTML: inline CSS and embed local images as cid attachments
    let html = fs.readFileSync(indexHtmlPath, "utf8");
    html = inlineCss(html, reportDir);

    const attachments: any[] = [];
    html = embedImages(html, reportDir, attachments);

    // optionally attach the full report zip if present 



    // also attach the HTML file itself so clients can download/open it
    attachments.push({
        filename: "playwright-report.html",
        content: html,
    });

    // 2️⃣ Mail details (HTML body uses the transformed html)

    const mailOptions = {
        from: "Shivangisaraswat1@gmail.com",
        to: "shivangi.saraswat@desklay.com",
        subject: "Playwright Test Report",
        text: "Hi Team,\n\nHTML report is attached and embedded in this email.\n\nRegards,\n Shivangi saraswat\n\nAutomation lead",
        html, attachments,
    };


    // 3️⃣ Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Error while sending email:", error);
        } else {
            console.log("✅ Email sent:", info.response);
        }
    });
})();
