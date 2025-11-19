from dotenv import load_dotenv
import os
from flask import Flask
from flask_cors import CORS
import sys
from flask import request, jsonify
import tensorflow as tf
from utils import load_model
import numpy as np

load_dotenv()

app = Flask(__name__)

origin_url = os.getenv("ORIGIN_URL")

if not origin_url:
    raise ValueError("ORIGIN_URL environment variable is not set.")

print("url vite: "+origin_url)

CORS(app, resources={
    r"/*": {
        "origins": [origin_url],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

model = load_model()

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        img_list = data.get("image")
        
        img_array = np.array(img_list)
        print(img_array.shape, file=sys.stdout)
        model_prediction = model.predict(img_array)
        predicted_class = int(np.argmax(model_prediction, axis=1)[0])
        confidences = model_prediction[0].tolist()

        return jsonify({
            "predicted_class": predicted_class,
            "softmax": confidences
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    port = int(os.environ.get("PORT", 5000))  # usa port 5000 local o $PORT en Render
    app.run(
        debug=os.getenv("FLASK_ENV") == "development", 
        use_reloader=False,
        host="0.0.0.0",
        port=port,
    )
