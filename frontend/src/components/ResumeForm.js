import { useState } from 'react';
import axios from 'axios';

export default function ResumeForm() {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [generatedResume, setGeneratedResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateResume = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5001/api/resume/generate', {
                resumeText,
                jobDescription,
            });
            setGeneratedResume(response.data.markdown);
        } catch (err) {
            setError('Error generating resume. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Generate ATS-Friendly Resume</h2>
            <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here"
                rows="10"
                cols="50"
            />
            <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here"
                rows="5"
                cols="50"
            />
            <button onClick={generateResume} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Resume'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {generatedResume && (
                <div>
                    <h3>Generated Resume (Markdown)</h3>
                    <pre>{generatedResume}</pre>
                    {/* Add a download button for DOCX */}
                    <a href="/download-resume" download="generated_resume.docx">
                        Download as DOCX
                    </a>
                </div>
            )}
        </div>
    );
}