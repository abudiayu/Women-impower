import re
import sqlite3
import traceback
from pathlib import Path

from flask import Flask, Response, jsonify, request, send_file

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "subscribers.db"
COMPONENTS_DIR = BASE_DIR / "components"
INDEX_FILE = BASE_DIR / "index.html"

app = Flask(
    __name__,
    static_folder=str(BASE_DIR / "static"),
    static_url_path="/static",
)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# ------------------------------------------------------------------
# SITE CONTENT: edit everything here, the React UI updates itself
# ------------------------------------------------------------------
SITE_CONTENT = {
    "brand": "Rise",
    "nav_links": ["Stories", "Programs", "About"],
    "hero": {
        "title_before": "Rise",
        "title_italic": "higher",
        "placeholder": "Enter your email",
        "subtitle": (
            "Weekly motivation, real stories and practical tools for women "
            "who are building the life they deserve. Join the circle today."
        ),
        "manifesto_button": "Read our manifesto",
        "hero_video": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
    },
    "about": {
        "label": "About Us",
        "before": "Empowering",
        "italic_1": "women",
        "middle": "to",
        "italic_2": "dream, lead, and become unstoppable.",
    },
    "featured": {
        "video": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4",
        "label": "Our Approach",
        "text": (
            "We believe every woman carries a story worth telling. Every "
            "challenge is a chapter, and every chapter makes her stronger."
        ),
        "button": "Explore more",
    },
    "philosophy": {
        "title_before": "Courage",
        "title_italic": "x",
        "title_after": "Growth",
        "video": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4",
        "blocks": [
            {
                "label": "Choose your path",
                "text": (
                    "Every meaningful breakthrough begins with a decision. We "
                    "help women turn bold ideas into action, one brave step "
                    "at a time."
                ),
            },
            {
                "label": "Shape your future",
                "text": (
                    "The best chapters are written when courage meets "
                    "consistency. Our community gives you the tools, "
                    "mentors and support to keep going."
                ),
            },
        ],
    },
    "services": {
        "title": "What we do",
        "side_label": "Our programs",
        "cards": [
            {
                "video": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
                "tag": "Mindset",
                "title": "Confidence & Self-Belief",
                "text": (
                    "Guided practices and daily reminders that rebuild your "
                    "inner voice and help you trust yourself again."
                ),
            },
            {
                "video": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
                "tag": "Career",
                "title": "Leadership & Growth",
                "text": (
                    "Mentorship, goal planning and community support to help "
                    "you lead, launch and level up on your own terms."
                ),
            },
        ],
    },
}


# ------------------------------------------------------------------
# Database
# ------------------------------------------------------------------
def init_db():
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


# Runs on every start, however the app is launched
init_db()


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def missing_file_page(path: Path) -> Response:
    html = f"""
    <body style="background:#000;color:#fff;font-family:sans-serif;padding:40px">
      <h2>File not found</h2>
      <p>The server looked for this file but could not find it:</p>
      <pre style="background:#111;padding:16px;border-radius:8px">{path}</pre>
      <p>Create the file at that exact location and refresh the page.</p>
    </body>
    """
    return Response(html, status=404, mimetype="text/html")


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------
@app.route("/")
def index():
    if not INDEX_FILE.is_file():
        return missing_file_page(INDEX_FILE)
    return send_file(str(INDEX_FILE), mimetype="text/html")


@app.route("/components/<path:filename>")
def components(filename):
    target = (COMPONENTS_DIR / filename).resolve()

    # Block path traversal (e.g. ../../secret)
    if COMPONENTS_DIR.resolve() not in target.parents:
        return Response("Forbidden", status=403)
    if not target.is_file():
        return missing_file_page(target)

    # Explicit type so the browser/Babel always treats .jsx as JavaScript
    return send_file(str(target), mimetype="text/javascript")


@app.route("/api/content")
def content():
    return jsonify(SITE_CONTENT)


@app.route("/api/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()

    if not EMAIL_RE.match(email) or len(email) > 254:
        return jsonify(ok=False, message="Please enter a valid email address."), 400

    try:
        with sqlite3.connect(str(DB_PATH)) as conn:
            conn.execute("INSERT INTO subscribers (email) VALUES (?)", (email,))
    except sqlite3.IntegrityError:
        return jsonify(ok=True, message="You're already part of the circle 💛")

    return jsonify(ok=True, message="Welcome to the circle! 🌸")


# ------------------------------------------------------------------
# Show the real error in the browser while developing
# ------------------------------------------------------------------
@app.errorhandler(Exception)
def handle_error(err):
    if hasattr(err, "code") and isinstance(err.code, int) and err.code < 500:
        return err  # normal 404s etc.
    trace = traceback.format_exc()
    print(trace)  # also appears in the VS Code terminal
    html = f"""
    <body style="background:#000;color:#fff;font-family:sans-serif;padding:40px">
      <h2>Server error</h2>
      <pre style="background:#111;padding:16px;border-radius:8px;
                  white-space:pre-wrap;color:#ff9b9b">{trace}</pre>
    </body>
    """
    return Response(html, status=500, mimetype="text/html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)