import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 🛡️ CORS configuration for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI CONFIGURATION ---
# Note: Always use os.environ.get for security. 
# Ensure these names match what you put in Vercel Settings.
genai.configure(api_key=os.environ.get("AIzaSyCasv5BQUxNdbCLfk0JTfNPk090IHKU-24"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

groq_client = Groq(api_key=os.environ.get("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"))

class Query(BaseModel):
    prompt: str
    model_choice: str = "gemini" # Default to gemini if not specified

@app.post("/ask")
async def ask_ai(query: Query):
    try:
        if query.model_choice.lower() == "groq":
            # Using Llama 3.3 via Groq for high speed
            chat_completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": query.prompt}],
                model="llama-3.3-70b-versatile",
            )
            return {"answer": chat_completion.choices[0].message.content}
        
        else:
            # Default to Gemini
            response = gemini_model.generate_content(query.prompt)
            return {"answer": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"status": "Kyros Multi-Model Backend is Live"}

# Vercel handles the serving, but this keeps local testing working
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)