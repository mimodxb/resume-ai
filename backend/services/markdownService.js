const fs = require("fs");
const Handlebars = require("handlebars");
const logger = require("../config/logger");
const path = require("path");

function applyMarkdownTemplate(data) {
    try {
        const templatePath = path.resolve(__dirname, "../templates/resumeTemplate.md");
        console.log("Attempting to read template from:", templatePath); // <---- THIS LINE IS IMPORTANT
        const templateContent = fs.readFileSync(templatePath, "utf8");
        const template = Handlebars.compile(templateContent);
        const markdown = template(data);

        logger.info("✅ Markdown successfully rendered:\n" + markdown);
        return markdown;
    } catch (error) {
        logger.error("🔥 Error applying Markdown template:", error);
        throw new Error("Failed to apply Markdown template");
    }
}

module.exports = { applyMarkdownTemplate };
