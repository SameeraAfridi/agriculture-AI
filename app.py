from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
import python_weather
import asyncio

app = Flask(__name__)

# Folder where uploaded images will be stored temporarily
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

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

        # Save the uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        # TODO: Replace this with actual ML model prediction
        fake_prediction = "Early Blight"

        # Delete file after processing (to avoid storage issues)
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({
            "filename": filename,
            "prediction": fake_prediction,
            "note": "This is a dummy prediction. Integrate ML model here."
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

            return {
                "city": city_name,
                "current_temperature": weather.temperature,
                "forecast": [
                    {
                        "date": str(daily.date),
                        "min_temp": daily.temperature_min,
                        "max_temp": daily.temperature_max
                    }
                    for daily in weather
                ]
            }
    except Exception as e:
        return {"error": f"Could not fetch weather for '{city_name}'", "details": str(e)}


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
    return "🌱 Image-based Crop Disease Detection & Weather API is running!"

if __name__ == "__main__":
    app.run(debug=True)
