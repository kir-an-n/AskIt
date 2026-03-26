import os
from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from groq import Groq

app = FastAPI()

# Configure AI Models from Vercel Environment Variables
gemini_key = os.environ.get("GEMINI_API_KEY")
groq_key = os.environ.get("GROQ_API_KEY")

if gemini_key:
    genai.configure(api_key=gemini_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')

if groq_key:
    groq_client = Groq(api_key=groq_key)

class Query(BaseModel):
    prompt: str
    model_choice: str = "gemini"

@app.get("/api/health")
async def health():
    return {"status": "online", "gemini": bool(gemini_key), "groq": bool(groq_key)}

@app.post("/api/ask")
async def ask_ai(query: Query):
    try:
        if query.model_choice == "groq" and groq_key:
            completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": query.prompt}],
                model="llama-3.3-70b-versatile"
            )
            return {"answer": completion.choices[0].message.content}
        else:
            response = gemini_model.generate_content(query.prompt)
            return {"answer": response.text}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}