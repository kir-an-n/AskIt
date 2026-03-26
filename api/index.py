import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

# --- FORCE LOAD ENV ---
# This looks for .env in the same folder as this script, 
# fixing the "Key Not Found" issue in your terminal.
current_file_path = Path(__file__).parent.resolve()
env_path = current_file_path / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# 🛡️ CORS Fix: Allows Vercel, v0, and localhost to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI CONFIGURATION ---
# We pull the names from your environment variables
gemini_key = os.environ.get("GEMINI_API_KEY")
groq_key = os.environ.get("GROQ_API_KEY")

# 🔍 Debug Print (Visible in your terminal and Vercel logs)
print(f"--- SYSTEM CHECK ---")
print(f"Looking for .env at: {env_path}")
print(f"Gemini Key Loaded: {bool(gemini_key)}")
print(f"Groq Key Loaded: {bool(groq_key)}")

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

@app.post("/api/ask")
async def ask_ai(query: Query):
    try:
        # Route 1: Groq (Llama 3.3)
        if query.model_choice.lower() == "groq" and groq_client:
            chat_completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": query.prompt}],
                model="llama-3.3-70b-versatile",
            )
            return {"answer": chat_completion.choices[0].message.content}
        
        # Route 2: Gemini (Default)
        elif gemini_model:
            response = gemini_model.generate_content(query.prompt)
            # Ensure we return the text, or a fallback if safety filters trigger
            answer_text = response.text if response.text else "The AI could not generate a response (Safety Filter)."
            return {"answer": answer_text}
        
        else:
            return {"answer": "Error: API keys are not found. Please check your .env or Vercel settings."}

    except Exception as e:
        return {"answer": f"System Error: {str(e)}"}

@app.get("/api/health")
async def health():
    return {
        "status": "Kyros is Online", 
        "gemini_active": bool(gemini_key), 
        "groq_active": bool(groq_key),
        "path": str(env_path)
    }

if __name__ == "__main__":
    import uvicorn
    # Use port 8000 for local development
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

@app.get("/api/health")
def health():
    return {"status": "online", "message": "Kyros Backend is live!"}

