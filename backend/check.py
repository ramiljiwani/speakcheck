from google import genai
import time

prompt = """You are a JSON-only response generator. Watch the video I provide, then answer only with a single JSON object matching exactly this structure (no markdown, no explanation, no extra keys):

{
  "Posture & Physical Presence": {
    "Analysis": "string",
    "Recommendations": ["string", ...],
    "Relevant Video Section": "string"
  },
  "Eye Contact": {
    "Analysis": "string",
    "Recommendations": ["string", ...],
    "Relevant Video Section": "string"
  },
  "Vocal Delivery": {
    "Analysis": "string",
    "Recommendations": ["string", ...],
    "Relevant Video Section": "string"
  },
  "Content & Structure": {
    "Analysis": "string",
    "Recommendations": ["string", ...],
    "Relevant Video Section": "string"
  },
  "Nervousness/Comfort": {
    "Analysis": "string",
    "Recommendations": ["string", ...],
    "Relevant Video Section": "string"
  },
  "Summary": {
    "Overall Assessment": "string",
    "Actionable Steps": ["string", ...]
  }
}

- For every category except "Summary", fill in Analysis, an array of Recommendations, and the exact Relevant Video Section (timestamp).
- For "Summary", fill in Overall Assessment and an array of Actionable Steps.
- Be as precise as possible about timestamps (e.g. "0:07-0:14").
- Do not wrap the JSON in markdown ticks or code fences.
- Do not output anything else.
"""



def analyze(video):
    # Step 1: Set up the Gemini client
    client = genai.Client(api_key="AIzaSyAn7RnvWQCA7MrJC-2JnAvIFRc9shSw7DY")

    # Step 2: Upload the video
    myfile = client.files.upload(file=video)

    # Step 3: Wait until file is ACTIVE
    print("Waiting for video to finish processing...")
    while True:
        status = client.files.get(name=myfile.name)  # ✅ correct
        if status.state.name == "ACTIVE":
            print("✅ File is ready.")
            break
        else:
            print(f"⏳ Current status: {status.state.name}... retrying in 2 seconds")
            time.sleep(2)

    # Step 4: Generate response
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            status,
            prompt
        ]
    )


    import re
    import json

    # Extract content between ```json ... ``` using regex
    match = re.search(r"```json\s*(\{.*?\})\s*```", response.text, re.DOTALL)

    if match:
        json_str = match.group(1)
        try:
            parsed = json.loads(json_str)
            with open("feedback.json", "w") as f:
                json.dump(parsed, f, indent=2)
            print("✅ JSON extracted and saved.")
        except json.JSONDecodeError:
            print("⚠️ JSON block found but couldn't parse it.")
    else:
        print("⚠️ No JSON block found in the response.")


    # Step 5: Print the results
    print(response.text)