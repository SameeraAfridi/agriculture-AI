from flask import Flask, request, jsonify
import os
import json
import hashlib
from werkzeug.utils import secure_filename
import python_weather
import asyncio
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# ---------------- FLASK SETUP ----------------
app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ---------------- USER AUTH (JSON BASED) ----------------
USER_FILE = "users.json"

def load_users():
    if not os.path.exists(USER_FILE):
        return []
    with open(USER_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        if not data or "username" not in data or "password" not in data:
            return jsonify({"error": "username and password required"}), 400

        username = data["username"]
        password = data["password"]

        users = load_users()
        if any(u["username"] == username for u in users):
            return jsonify({"error": "Username already exists"}), 400

        users.append({"username": username, "password": hash_password(password)})
        save_users(users)
        return jsonify({"message": "Signup successful!"}), 201
    except Exception as e:
        return jsonify({"error": "Internal error during signup", "details": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data or "username" not in data or "password" not in data:
            return jsonify({"error": "username and password required"}), 400

        username = data["username"]
        password = data["password"]

        users = load_users()
        for user in users:
            if user["username"] == username and user["password"] == hash_password(password):
                return jsonify({"message": f"Welcome {username}!"}), 200

        return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": "Internal error during login", "details": str(e)}), 500


# ---------------- IMAGE BASED DISEASE DETECTION ----------------
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only JPG and PNG are allowed"}), 400

        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        # TODO: Replace this with actual ML model
        fake_prediction = "Early Blight"

        # Delete after processing
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({
            "filename": filename,
            "prediction": fake_prediction,
            "note": "This is a dummy prediction. Replace with actual ML model."
        })

    except Exception as e:
        return jsonify({"error": "Internal error while processing upload", "details": str(e)}), 500


# ---------------- WEATHER FETCHING ----------------
async def fetch_weather(city_name: str):
    try:
        async with python_weather.Client(unit=python_weather.IMPERIAL) as client:
            weather = await client.get(city_name)

            if not weather or weather.temperature is None:
                return {"error": f"No weather data found for '{city_name}'"}

            forecast_data = []
            for daily in weather.daily_forecasts:
                # New library only gives `temperature`
                temp = getattr(daily, "temperature", None)

                # Fake min/max if not available
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
        return {
            "error": f"Could not fetch weather for '{city_name}'",
            "details": str(e)
        }


@app.route("/weather", methods=["GET"])
def get_weather():
    try:
        city_name = request.args.get("city")
        if not city_name:
            return jsonify({"error": "City parameter is required"}), 400

        if os.name == "nt":  # Windows fix
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

        weather_data = asyncio.run(fetch_weather(city_name))
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({"error": "Internal error while fetching weather", "details": str(e)}), 500


# ---------------- YIELD FORECASTING ----------------
@app.route("/yield_forecast", methods=["POST"])
def yield_forecast():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "JSON body required"}), 400

        # Validate inputs
        try:
            temp = float(data.get("Temperature"))
            rain = float(data.get("Rainfall"))
            nitrogen = float(data.get("Soil_Nitrogen"))
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid input values. Provide numeric Temperature, Rainfall, Soil_Nitrogen"}), 400

        # Synthetic dataset (replace with real crop data)
        dataset = {
            "Temperature": [25, 28, 22, 30, 26, 29, 23, 27, 24, 31],
            "Rainfall": [150, 180, 120, 200, 160, 190, 130, 170, 140, 210],
            "Soil_Nitrogen": [50, 60, 45, 65, 55, 62, 48, 58, 52, 68],
            "Yield": [500, 550, 450, 600, 520, 580, 470, 530, 480, 620]
        }
        df = pd.DataFrame(dataset)

        # Train model
        X = df[["Temperature", "Rainfall", "Soil_Nitrogen"]]
        y = df["Yield"]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = LinearRegression()
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        # Evaluation
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        # Forecast new data
        new_data = pd.DataFrame([{"Temperature": temp, "Rainfall": rain, "Soil_Nitrogen": nitrogen}])
        predicted_yield = model.predict(new_data)[0]

        return jsonify({
            "input": {"Temperature": temp, "Rainfall": rain, "Soil_Nitrogen": nitrogen},
            "predicted_yield": f"{predicted_yield:.2f} kg/acre",
            "model_metrics": {
                "Mean_Squared_Error": round(mse, 2),
                "R2_Score": round(r2, 2)
            }
        })
    except Exception as e:
        return jsonify({"error": "Internal error while forecasting yield", "details": str(e)}), 500


# ---------------- GLOBAL ERROR HANDLERS ----------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": "Unexpected error", "details": str(e)}), 500


# ---------------- MAIN ----------------
@app.route("/")
def index():
    return "🌱 Crop Disease Detection, Weather & Yield Forecasting API with Auth is running!"

if __name__ == "__main__":
    app.run(debug=True)  