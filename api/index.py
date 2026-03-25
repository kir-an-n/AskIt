import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 🛡️ THE CORS FIX: This allows your Vercel frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("AIzaSyCasv5BQUxNdbCLfk0JTfNPk090IHKU-24"))
model = genai.GenerativeModel('gemini-1.5-flash')

class Query(BaseModel):
    prompt: str

@app.post("/ask-gemini")
async def ask_gemini(query: Query):
    try:
        response = model.generate_content(query.prompt)
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"status": "Kyros Backend is Live"}

# 🚀 RENDER LOGIC: Render will automatically inject a $PORT variable
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)