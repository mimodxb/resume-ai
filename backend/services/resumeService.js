const { generatePrompt } = require("./promptService");
const { callLLM } = require("./ollamaService");
const { cleanResponse } = require("./cleanResponseService");
const { applyMarkdownTemplate } = require("./markdownService");
const { convertMarkdownToDocx } = require("./pandocService");
const logger = require("../config/logger");

async function processResume(resumeText, jobDescription) {
    try {
        logger.info("📡 Generating prompt...");
        const prompt = await generatePrompt(resumeText, jobDescription);
        logger.info("📡 Sending request to LLM...");
        const llmResponse = await callLLM(prompt);
        logger.info("📡 Cleaning LLM response...");
        const resumeData = await cleanResponse(llmResponse);

        if (!resumeData) {
            logger.error("❌ LLM did not return structured JSON");
            throw new Error("LLM failed to generate structured JSON");
        }
        logger.info("✅ LLM returned structured JSON", resumeData);

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