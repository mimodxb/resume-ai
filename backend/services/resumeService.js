const { generateResumeData } = require("./ollamaService");
const { applyMarkdownTemplate } = require("./markdownService");
const { convertMarkdownToDocx } = require("./pandocService");
const logger = require("../config/logger");

async function processResume(resumeText, jobDescription) {
    try {
        logger.info("📡 Sending request to Ollama...");
        const resumeData = await generateResumeData(resumeText, jobDescription);

        if (!resumeData) {
            logger.error("❌ Ollama did not return structured JSON");
            throw new Error("Ollama failed to generate structured JSON");
        }
        logger.info("✅ Ollama returned structured JSON", resumeData);

        logger.info("📄 Applying Markdown template...");
        const markdown = applyMarkdownTemplate(resumeData);
        logger.info("✅ Markdown generated:\n" + markdown);

        logger.info("📄 Converting Markdown to DOCX...");
        const docxPath = await convertMarkdownToDocx(markdown, "generated_resume");
        logger.info("✅ DOCX saved at:", docxPath);

        return { markdown, docxPath };
    } catch (error) {
        logger.error("🔥 Resume processing error:", error);
        throw new Error("Resume processing failed");
    }
}

module.exports = { processResume };