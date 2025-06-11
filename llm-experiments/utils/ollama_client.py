import requests

def generate_response(prompt: str, temperature: float = 0.7, model: str = "gemma3 1B"):
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": model,
        "prompt": prompt,
        "temperature": temperature
    })
    response.raise_for_status()
    return response.json()["response"]