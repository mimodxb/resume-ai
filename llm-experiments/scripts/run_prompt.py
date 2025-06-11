import argparse
import pandas as pd
import mlflow
from models.prompt_model import PromptModel

def main(prompt: str, temperature: float):
    with mlflow.start_run():
        mlflow.log_param("prompt", prompt)
        mlflow.log_param("temperature", temperature)

        model = PromptModel()
        input_df = pd.DataFrame({"prompt": [prompt], "temperature": [temperature]})
        response = model.predict(None, input_df)

        mlflow.log_text(response, "response.txt")
        mlflow.log_metric("length", len(response))
        print("\n🧠 Response:\n", response)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", type=str, required=True)
    parser.add_argument("--temperature", type=float, default=0.7)
    args = parser.parse_args()
    main(args.prompt, args.temperature)