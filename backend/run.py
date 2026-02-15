from dotenv import load_dotenv
import os

from flask_cors import CORS
from gt_app import create_app

# 🔥 Load .env file
load_dotenv()

app = create_app()
CORS(app)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
