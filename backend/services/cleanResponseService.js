const logger = require("../config/logger");

async function cleanResponse(response) {
    try {
        logger.info("📡 Cleaning LLM response", { response });

        // Clean the response (remove any unwanted formatting like Markdown)
        let rawResponse = response.trim();
        if (rawResponse.startsWith("```json")) {
            rawResponse = rawResponse.replace(/^```json\n/, "").replace(/\n```$/, "");
        }

        return JSON.parse(rawResponse);
    } catch (error) {
        logger.error("🔥 Response Cleaning Error:", error);
        throw new Error("Failed to generate structured JSON from LLM response.");
    }
}

module.exports = { cleanResponse };
