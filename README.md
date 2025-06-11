Make sure your ENV files are properly set with your backend, front end and ollama serving port!

[Check Discussions](https://github.com/resume-llm/resume-ai/discussions) 
# 🚀 AI-Powered Resume Generator

## 📌 Overview
This project is an **AI-powered resume generator** designed to take **unstructured profile information and job descriptions** as input, then generate **ATS-friendly, structured resumes** using **Ollama + Gemma 3B/1B**.  

The goal is to transform vague, unstructured resume data into **professionally formatted, job-tailored resumes**, ensuring:  
✅ **STAR method for experience** (Situation, Task, Action, Result)  
✅ **Job description alignment** (matches employer expectations)  
✅ **ATS compatibility** (optimized for applicant tracking systems)  

## 🛠️ Tech Stack
- **[Ollama](https://ollama.com/)** (for local LLM execution)  
- **Gemma 3B/1B** (lightweight LLM)  
- **Node.js + Express** (backend API to process resumes)  
- **Handlebars.js** (template engine for structured resume formatting)  
- **Pandoc** (for conversion to .docx)  

## 🔧 How It Works
1. **User submits unstructured profile + job description**  
2. **Ollama + Gemma processes the input**  
   - Reformats vague experience using the **STAR method**  
   - Aligns content with **job description requirements**  
   - Ensures **structured JSON output**  
3. **Handlebars.js formats the resume** (Markdown → .docx conversion via Pandoc)  
4. **Final resume is exported as a professional document**  

---

## 🚀 Installation & Setup

### 📌 Prerequisites  
Before starting, ensure you have the following installed:  
✅ **[Node.js & npm](https://nodejs.org/)**  
✅ **[Ollama](https://ollama.com/)** (for running Gemma locally)  
✅ **[Pandoc](https://pandoc.org/installing.html)** (for Markdown to `.docx` conversion)  

---

### 🔧 Installation Steps

1️⃣ **Clone the repository**  
```bash
git clone https://github.com/your-repo/resume-ai.git
cd resume-ai
```
2️⃣ **Install dependencies**

```bash
npm install
```
3️⃣ Set up environment variables
Create a .env file in the root directory and add:
```
LLM_URL=http://localhost:11434/api/generate
MODEL_NAME=gemma3:1b
PORT=5001
```
4️⃣ **Download the Ollama model (Gemma 3B/1B)**

ollama pull gemma3:1b

🚀 Running the API

Start the server:

npm start

It should log:

🚀 Server running on port 5001

📡 API Usage

To test the resume generator, send a request using cURL:

	curl -X POST http://localhost:5001/api/resume/generate \
	  -H "Content-Type: application/json" \
	  -d '{
	         "resumeText": "John Doe is a Cloud Engineer...",
	         "jobDescription": "Cloud Engineer - AWS, Kubernetes"
	  }'

It should return structured JSON.

🛠️ Running Tests

1️⃣ Run Unit Tests

npm test

2️⃣ Check for Linting Errors

npm run lint

📦 Converting Markdown to .docx

After generating the Markdown resume, convert it to .docx using Pandoc:

pandoc output/resume.md -o output/resume.docx

📜 Contribution Guidelines

1️⃣ Fork the repository
2️⃣ Create a new branch for your feature
3️⃣ Submit a pull request with a description of your changes
