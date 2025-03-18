const { processResume } = require("../services/resumeService");
const logger = require("../config/logger");

async function generateResume(req, res) {
    try {
        const { resumeText, jobDescription } = req.body;
        logger.info("➡️ Received API request", { resumeText, jobDescription });

        if (!resumeText || !jobDescription) {
            logger.error("❌ Missing required fields");
            return res.status(400).json({ message: "resumeText and jobDescription are required" });
        }

        const { markdown, docxPath } = await processResume(resumeText, jobDescription);

        logger.info("✅ Successfully generated resume");
        res.json({ markdown, docxPath });
    } catch (error) {
        logger.error("🔥 Error generating resume:", error);
        res.status(500).json({ message: "Resume processing failed" });
    }
}

module.exports = { generateResume };