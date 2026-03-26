import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from groq import Groq

app = FastAPI()

# Standard Vercel CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keys from Vercel Dashboard
gemini_key = os.environ.get("GEMINI_API_KEY")
groq_key = os.environ.get("GROQ_API_KEY")

if gemini_key:
    genai.configure(api_key=gemini_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    gemini_model = None

if groq_key:
    groq_client = Groq(api_key=groq_key)
else:
    groq_client = None

class Query(BaseModel):
    prompt: str
    model_choice: str = "gemini"

@app.get("/api/health")
async def health():
    return {"status": "online", "gemini": bool(gemini_key), "groq": bool(groq_key)}

@app.post("/api/ask")
async def ask_ai(query: Query):
    try:
        # Route to Groq if selected
        if query.model_choice.lower() in ["grok", "groq"] and groq_client:
            completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": query.prompt}],
                model="llama-3.3-70b-versatile",
            )
            return {"answer": completion.choices[0].message.content}
        
        # Default to Gemini
        elif gemini_model:
            response = gemini_model.generate_content(query.prompt)
            return {"answer": response.text}
        
        return {"answer": "Error: AI Model not configured."}
    except Exception as e:
        return {"answer": f"Backend Error: {str(e)}"}