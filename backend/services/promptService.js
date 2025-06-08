const logger = require("../config/logger");
const fs = require("fs");  // Add the fs module
const path = require("path"); // Import the 'path' module

async function generatePrompt(resumeText, jobDescription) {
    try {
        logger.info("📡 Generating prompt from resume text and job description", { resumeText, jobDescription });

        // Step 1: Construct the full path to the prompt template
        const promptPath = path.resolve(__dirname, '../prompts/resumePrompt.txt');
        console.log("Attempting to read prompt template from:", promptPath); // Add this line

        const promptTemplate = fs.readFileSync(promptPath, 'utf8');

        // Step 2: Replace placeholders with actual resumeText and jobDescription
        const prompt = promptTemplate
            .replace("{resumeText}", resumeText)
            .replace("{jobDescription}", jobDescription);

        return prompt;
    } catch (error) {
        logger.error("🔥 Prompt generation Error:", error);
        throw new Error("Failed to generate prompt from template.");
    }
}

module.exports = { generatePrompt };
