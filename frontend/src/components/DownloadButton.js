import React from "react";
import axios from "axios";

export default function DownloadButton({ markdown }) {
    const downloadResume = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/resume/download", { markdown }, { responseType: "blob" });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "resume.docx");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Failed to download resume:", error);
        }
    };

    return <button onClick={downloadResume}>Download DOCX</button>;
}