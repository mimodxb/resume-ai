const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const logger = require("../config/logger");

async function convertMarkdownToDocx(markdown, filename = "resume") {
    try {
        const outputPath = path.join(__dirname, "..", "output", `${filename}.docx`);
        const tempMarkdownPath = path.join(__dirname, "..", "output", `${filename}.md`);

        await fs.writeFile(tempMarkdownPath, markdown, "utf8");

        const command = `pandoc "${tempMarkdownPath}" -o "${outputPath}"`;
        logger.info(`⚙️ Executing Pandoc: ${command}`);

        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`🔥 Pandoc Error: ${error.message}`);
                    return reject(new Error(`Failed to convert to DOCX: ${error.message}`));
                }
                if (stderr) {
                    logger.warn(`⚠️ Pandoc Warning: ${stderr}`);
                }
                logger.info("✅ Pandoc conversion successful");
                resolve();
            });
        });

        await fs.unlink(tempMarkdownPath);
        logger.info("✅ DOCX File Path:", outputPath);
        return outputPath;
    } catch (error) {
        logger.error("🔥 Error converting Markdown to DOCX:", error);
        throw new Error("Failed to convert Markdown to DOCX");
    }
}

module.exports = { convertMarkdownToDocx };