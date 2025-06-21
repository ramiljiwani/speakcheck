import google.generativeai as genai

client = genai.Client(api_key="AIzaSyAn7RnvWQCA7MrJC-2JnAvIFRc9shSw7DY")

myfile = client.files.upload(file="test.mp4")

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=[myfile, "What could I (the person in the video) do to improve my speaking skills? Give examples on how to improve. Be as detailed as possible -- and include everything including posture, eye contact, prononciation, etc. be specific when you mention a part from the video and mention the time-stamp too(be precise). Could you put it in json format with the categories being: Posture & Physical Presence, Eye Contact, Vocal Delivery, Content & Structure, Nervousness/Comfort and Summary"]
)

print(response.text)