# Code Enhancer AI

An AI-powered code analysis and optimization tool. Paste your code, select a language, and get instant feedback on complexity, issues, and an optimized version.

🔗 **Live Demo** → [codeenhancer.vercel.app](https://codeenhancer.vercel.app)

---

## What It Does

- Detects syntax errors with line references
- Analyzes time and space complexity
- Identifies performance issues and anti-patterns
- Suggests better algorithms and data structures
- Returns a clean optimized version of your code

---

## Supported Languages

Python · C++ · C · Java · C#

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

**Backend**
- Python Flask
- OpenRouter API 
- GROQ API

---



## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:
```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/auto
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-70b-versatile
FLASK_DEBUG=1
```

Run the server:
```bash
python run.py
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

Run the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API

### `POST /analyze`

**Request**
```json
{
  "code": "your source code here",
  "language": "python"
}
```

**Response**
```json
{
  "status": "success",
  "syntax_check": { "valid": true, "errors": [] },
  "analysis": {
    "language": "python",
    "detected_patterns": ["nested loops"],
    "time_complexity": "O(n^2)",
    "space_complexity": "O(1)"
  },
  "issues": [],
  "optimizations": [],
  "optimized_code": {
    "code": "optimized version here",
    "notes": "key changes made"
  }
}
```

### `GET /health`
Returns service status.

