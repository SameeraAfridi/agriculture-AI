from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import python_weather
import asyncio
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import numpy as np 

import cv2
from tensorflow.keras.models import load_model
import joblib
import os 
import json
import logging


# ---------------- FLASK SETUP ----------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # allow React dev server

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ---------------- USER AUTH (JSON FILE BASED) ----------------
USER_FILE = "users.json"

def load_users():
    if not os.path.exists(USER_FILE):
        return []
    with open(USER_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        if not data or "username" not in data or "password" not in data:
            return jsonify({"error": "username and password required"}), 400

        username = data["username"]
        password = data["password"]

        users = load_users()
        if any(u["username"] == username for u in users):
            return jsonify({"error": "Username already exists"}), 400

        users.append({"username": username, "password": generate_password_hash(password)})
        save_users(users)
        return jsonify({"message": "Signup successful!"}), 201
    except Exception as e:
        return jsonify({"error": "Internal error during signup", "details": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data or "username" not in data or "password" not in data:
            return jsonify({"error": "username and password required"}), 400

        username = data["username"]
        password = data["password"]

        users = load_users()
        for user in users:
            if user["username"] == username and check_password_hash(user["password"], password):
                return jsonify({"message": f"Welcome {username}!"}), 200

        return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": "Internal error during login", "details": str(e)}), 500

# ---------------- IMAGE UPLOAD ----------------
# ---------------- ALLOWED FILE TYPES ----------------
def allowed_file(filename):
    allowed_extensions = {"jpg", "jpeg", "png"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions

disease_model, disease_classes = None, []

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Define paths
    BASE_DIR = os.path.dirname(__file__)
    MODEL_PATH = os.path.join(
        BASE_DIR,
        "../agriculture-AI-feature-ai-models/",
        "agriculture-AI-feature-ai-models/",
        "Pesticide_Yield_Model",
        "Pesticide_Yield_Model.pkl"
    )
    CLASS_INDICES_PATH = os.path.join(
        BASE_DIR,
        "../agriculture-AI-feature-ai-models/",
        "agriculture-AI-feature-ai-models/",
        "Pesticide_Yield_Model",
        "Plant disease model",
        "class_indices.json"
    )

    # Load model
    disease_model = load_model(MODEL_PATH)

    # Load class indices
    with open(CLASS_INDICES_PATH, "r") as f:
        class_indices = json.load(f)
        disease_classes = [None] * len(class_indices)
        for label, index in class_indices.items():
            disease_classes[index] = label

    logger.info("✅ Disease model and class indices loaded successfully!")

except Exception as e:
    logger.error("⚠️ Could not load disease model or class indices: %s", e)
    disease_model, disease_classes = None, []


# ---------------- IMAGE UPLOAD + DISEASE PREDICTION ----------------
@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only JPG and PNG allowed"}), 400

        # Save file temporarily
        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)
        print(f"📂 Saved file at {filepath}")

        prediction, confidence = "Dummy Prediction (Model not loaded)", 0.0

        # --- Run ML model if available ---
        if disease_model is not None and disease_classes:
            try:
                img = cv2.imread(filepath)
                img = cv2.resize(img, (128, 128))
                img = img.astype("float32") / 255.0
                img = np.expand_dims(img, axis=0)   # shape (1,128,128,3)

                preds = disease_model.predict(img)
                pred_index = int(np.argmax(preds[0]))
                prediction = disease_classes[pred_index]
                confidence = float(np.max(preds[0]))
            except Exception as model_err:
                print("⚠️ Prediction failed:", model_err)
                prediction, confidence = "Error during prediction", 0.0

        # Return the prediction result
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "filename": filename
        })
    except Exception as e:
        return jsonify({"error": "Internal error during image upload", "details": str(e)}), 500


# ---------------- WEATHER FETCH ----------------
async def fetch_weather(city_name: str):
    try:
        async with python_weather.Client(unit=python_weather.IMPERIAL) as client:
            weather = await client.get(city_name)
            if not weather or weather.temperature is None:
                return {"error": f"No weather data for '{city_name}'"}

            forecast_data = []
            for daily in weather.daily_forecasts:
                temp = getattr(daily, "temperature", None)
                min_temp = temp - 2 if temp is not None else "N/A"
                max_temp = temp + 2 if temp is not None else "N/A"
                forecast_data.append({
                    "date": str(daily.date),
                    "min_temp": min_temp,
                    "max_temp": max_temp
                })

            return {
                "city": city_name,
                "current_temperature": weather.temperature,
                "forecast": forecast_data
            }
    except Exception as e:
        return {"error": f"Could not fetch weather for '{city_name}'", "details": str(e)}

@app.route("/weather", methods=["GET"])
def get_weather():
    try:
        city_name = request.args.get("city")
        if not city_name:
            return jsonify({"error": "City parameter required"}), 400

        if os.name == "nt":
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

        weather_data = asyncio.run(fetch_weather(city_name))
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({"error": "Internal error while fetching weather", "details": str(e)}), 50

# ---------------- BASIC YIELD FORECAST (Dummy Linear Regression) ----------------
"""_dataset = {
    "Temperature": [25, 28, 22, 30, 26, 29, 23, 27, 24, 31],
    "Rainfall": [150, 180, 120, 200, 160, 190, 130, 170, 140, 210],
    "Soil_Nitrogen": [50, 60, 45, 65, 55, 62, 48, 58, 52, 68],
    "Yield": [500, 550, 450, 600, 520, 580, 470, 530, 480, 620]
}
_df = pd.DataFrame(_dataset)
_X = _df[["Temperature", "Rainfall", "Soil_Nitrogen"]]
_y = _df["Yield"]
_model = LinearRegression().fit(_X, _y)

@app.route("/yield_forecast", methods=["POST"])
def yield_forecast():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body required"}), 400

        try:
            temp = float(data.get("Temperature"))
            rain = float(data.get("Rainfall"))
            nitrogen = float(data.get("Soil_Nitrogen"))
        except (TypeError, ValueError):
            return jsonify({"error": "Provide numeric Temperature, Rainfall, Soil_Nitrogen"}), 400

        new_data = pd.DataFrame([{
            "Temperature": temp,
            "Rainfall": rain,
            "Soil_Nitrogen": nitrogen
        }])
        predicted_yield = _model.predict(new_data)[0]

        y_pred = _model.predict(_X)
        mse = mean_squared_error(_y, y_pred)
        r2 = r2_score(_y, y_pred)

        return jsonify({
            "input": {"Temperature": temp, "Rainfall": rain, "Soil_Nitrogen": nitrogen},
            "predicted_yield": f"{predicted_yield:.2f} kg/acre",
            "model_metrics": {
                "Mean_Squared_Error": round(mse, 2),
                "R2_Score": round(r2, 2)
            }
        })
    except Exception as e:
        return jsonify({"error": "Internal error while forecasting yield", "details": str(e)}), 500"""

# ---------------- ADVANCED ML YIELD FORECAST ----------------




def safe_load(path):
    """Try joblib first, fall back to pickle if needed."""
    try:
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as f:
            return pickle.load(f)

try:
    BASE_PATH = os.path.join(
        os.path.dirname(__file__),
        "../agriculture-AI-feature-ai-models/agriculture-AI-feature-ai-models/Pesticide_Yield_Model"
    )

    adv_model = safe_load(os.path.join(BASE_PATH, "pesticide_yield_model.pkl"))
    scaler = safe_load(os.path.join(BASE_PATH, "scaler.pkl"))
    area_encoder = safe_load(os.path.join(BASE_PATH, "area_encoder.pkl"))
    item_encoder = safe_load(os.path.join(BASE_PATH, "item_encoder.pkl"))

    print("✅ Advanced ML model and encoders loaded successfully!")
except Exception as e:
    adv_model, scaler, area_encoder, item_encoder = None, None, None, None
    print("⚠️ Could not load advanced ML model:", e)


@app.route("/predict_yield", methods=["POST"])
def predict_yield():
    try:
        if not adv_model or not scaler or not area_encoder or not item_encoder:
            return jsonify({"error": "ML model not available"}), 500

        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body required"}), 400

        try:
            area = data.get("area")
            item = data.get("item")
            rainfall = float(data.get("rainfall"))
            temperature = float(data.get("temperature"))
            pesticide = float(data.get("pesticide"))
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid or missing numeric values"}), 400

        # Encode categorical features
        try:
            area_encoded = area_encoder.transform([area])[0]
            item_encoded = item_encoder.transform([item])[0]
        except Exception:
            return jsonify({"error": "Invalid area or item value"}), 400

        # Scale + predict
        input_data = np.array([[area_encoded, item_encoded, rainfall, temperature, pesticide]])
        input_scaled = scaler.transform(input_data)
        prediction = adv_model.predict(input_scaled)[0]

        return jsonify({
            "input": data,
            "predicted_yield": float(prediction)
        })
    except Exception as e:
        return jsonify({"error": "Internal error during prediction", "details": str(e)}), 500


        # Encode categorical features
        try:
            area_encoded = area_encoder.transform([area])[0]
            item_encoded = item_encoder.transform([item])[0]
        except Exception:
            return jsonify({"error": "Invalid area or item value"}), 400

        # Scale + predict
        input_data = np.array([[area_encoded, item_encoded, rainfall, temperature, pesticide]])
        input_scaled = scaler.transform(input_data)
        prediction = adv_model.predict(input_scaled)[0]

        return jsonify({
            "input": data,
            "predicted_yield": float(prediction)
        })
    except Exception as e:
        return jsonify({"error": "Internal error during prediction", "details": str(e)}), 500

# ---------------- ERROR HANDLERS ----------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

# ---------------- MAIN ----------------
@app.route("/")
def index():
    return "🌱 Flask API for Crop Prediction, Weather & Auth is running!"

if __name__ == "__main__":
    app.run(debug=True)
