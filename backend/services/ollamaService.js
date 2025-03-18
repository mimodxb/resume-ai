const axios = require("axios");
const logger = require("../config/logger");
const fs = require("fs");  // Add the fs module
const path = require("path"); // Import the 'path' module
require("dotenv").config();

async function generateResumeData(resumeText, jobDescription) {
    try {
        logger.info("📡 Calling Ollama API for structured resume data", { resumeText, jobDescription });

        // Step 1: Construct the full path to the prompt template
        const promptPath = path.resolve(__dirname, '../prompts/resumePrompt.txt');
        console.log("Attempting to read prompt template from:", promptPath); // Add this line

        const promptTemplate = fs.readFileSync(promptPath, 'utf8');

        // Step 2: Replace placeholders with actual resumeText and jobDescription
        const prompt = promptTemplate
            .replace("{resumeText}", resumeText)
            .replace("{jobDescription}", jobDescription);

        // Step 3: Send the request to Ollama API with the generated prompt
        const response = await axios.post(process.env.OLLAMA_URL, {
            model: process.env.MODEL_NAME,
            stream: false,
            prompt: prompt,
        });

        logger.info("📡 Ollama API Raw Response:", response.data);

        // Step 4: Clean the response (remove any unwanted formatting like Markdown)
        let rawResponse = response.data.response.trim();
        if (rawResponse.startsWith("```json")) {
            rawResponse = rawResponse.replace(/^```json\n/, "").replace(/\n```$/, "");
        }

        return JSON.parse(rawResponse);
    } catch (error) {
        logger.error("🔥 Ollama API Error:", error);
        throw new Error("Failed to generate structured JSON from Ollama.");
    }
}

module.exports = { generateResumeData };
