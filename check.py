from google import genai
import time


def analyze(video):
    # Step 1: Set up the Gemini client
    client = genai.Client(api_key="AIzaSyAn7RnvWQCA7MrJC-2JnAvIFRc9shSw7DY")

    # Step 2: Upload the video
    myfile = client.files.upload(file="video")

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
            "What could I (the person in the video) do to improve my speaking skills? Give examples on how to improve. Be as detailed as possible -- and include everything including posture, eye contact, pronunciation, etc. Be specific when you mention a part from the video and mention the time-stamp too (be precise). Could you put it in JSON format with the categories being: Posture & Physical Presence, Eye Contact, Vocal Delivery, Content & Structure, Nervousness/Comfort and Summary. Also other than the json, dont write aything else"
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
            with open("speaking_feedback.json", "w") as f:
                json.dump(parsed, f, indent=2)
            print("✅ JSON extracted and saved.")
        except json.JSONDecodeError:
            print("⚠️ JSON block found but couldn't parse it.")
    else:
        print("⚠️ No JSON block found in the response.")


    # Step 5: Print the results
    print(response.text)
