# 🧠 Resume Builder App

This application generates ATS-friendly resumes based on job descriptions and unstructured input data. It is composed of a `frontend` and `backend` service, orchestrated using Docker Compose.

## 📦 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Running the App

To start the application, run:

```bash
docker-compose up --build
```
	•	The frontend will be available at: http://localhost:8080
	•	The backend API will be available at: http://localhost:5001

## 🌐 Backend Environment Variables

CORS_ORIGIN	Allowed origin for frontend requests
LLM_URL	URL to the LLM API (e.g., Ollama instance)
MODEL_NAME	Model to use for inference
PORT	Port the backend service listens on

## 📂 Output Directory

All generated resumes and related files are saved in the local ./output directory, which is mounted into the backend container.

## 📌 Kanban-Board (New Version — Under Development)

A new version of the application is being developed inside the kanban-board folder.

This new app is a standalone service that includes:

	•	Resume generation (currently does not export yet)
	•	A Kanban board to track your job applications
	•	AI-powered actionables to help you move each application forward

To run or contribute to this new version, please refer to the documentation in kanban-board/README.md.

