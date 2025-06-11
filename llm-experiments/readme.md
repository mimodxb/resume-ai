# 🧪 LLM Experiments with Ollama + MLflow (WIP)

A lightweight, modular framework to run and track **prompt engineering experiments** locally using:

- 🧠 [Ollama](https://ollama.com) for running LLMs on your machine
- 📊 [MLflow](https://mlflow.org) for tracking prompts, parameters, outputs, and evaluation metrics

Ideal for testing different instructions, temperatures, and prompt formats in a reproducible, versioned, and observable way.

---

## 🚀 Quickstart

### 1. Clone the project

```bash
git clone https://github.com/thiago4int/resume-ai.git
cd llm-experiments
```

2. Set up environment
```bash

pip install -r requirements.txt
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Make sure Ollama is installed and running locally (Gemma 3 1B Hardcoded, change utils for other models)

3. Run your first prompt
```bash
python scripts/run_prompt.py --prompt "What is the doctrine of justification by faith?" --temperature 0.8
```
Then launch the MLflow UI:

```bash
mlflow ui
# Open http://localhost:5000 to inspect your prompt run
```


🗂 Project Structure
```bash
llm-experiments/
├── README.md
├── requirements.txt
├── mlruns/                     # MLflow auto-logged data
│
├── models/
│   └── prompt_model.py         # MLflow PyFunc that wraps prompt generation
│
├── prompts/
│   └── registry.json           # (Optional) Prompt templates or metadata
│
├── scripts/
│   ├── run_prompt.py           # Run prompt and log result
│   └── serve_model.py          # (Optional) Serve prompt model via REST
│
├── utils/
│   ├── ollama_client.py        # Ollama API client
│   └── metrics.py              # (Optional) Prompt quality scoring
│
└── notebooks/
    └── prompt_experiments.ipynb  # (Optional) Interactive dev/testing
```


## ✍️ Contributing
1.	Fork this repo and create a feature branch:

```bash
git checkout -b feature/<short-description>
```
2.	Copy the task checklist from the relevant issue, and check off what you’ve completed.
3.	Use clear commit messages
4.	Open a PR referencing the issue (Closes #X) and explain:
	•	What was done
	•	How to test it
	•	Any known issues or limitations


🧠 Why This Exists

Running local LLMs like llama3, gemma 3 or phi3 via Ollama is fast, private, and cost-free — but experimenting at scale requires organization.

