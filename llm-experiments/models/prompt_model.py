import mlflow.pyfunc
from utils.ollama_client import generate_response

class PromptModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input):
        prompt = model_input["prompt"][0]
        temperature = float(model_input.get("temperature", [0.7])[0])
        return generate_response(prompt, temperature=temperature)