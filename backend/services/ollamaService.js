const axios = require("axios");
const logger = require("../config/logger");
require("dotenv").config();

async function callLLM(prompt) {
    try {
        logger.info("📡 Calling Ollama API for structured resume data", { prompt });

        // Send the request to Ollama API with the generated prompt
        const response = await axios.post(process.env.LLM_URL, {
            model: process.env.MODEL_NAME,
            stream: false,
            prompt: prompt,
        });

        logger.info("📡 Ollama API Raw Response:", response.data);

        return response.data.response;
    } catch (error) {
        logger.error("🔥 Ollama API Error:", error);
        throw new Error("Failed to get response from Ollama.");
    }
}

module.exports = { callLLM };
