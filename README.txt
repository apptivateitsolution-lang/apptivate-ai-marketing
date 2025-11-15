Apptivate Ai Marketing - Next.js (Personal Edition)
--------------------------------------------------
Quick start (local):

1) Copy the file .env.example to .env.local and add your OpenAI API key:
   OPENAI_API_KEY=sk-your-key-here

2) Install dependencies:
   npm install

3) Run development server:
   npm run dev

4) Open in browser:
   http://localhost:3000

Notes:
- The API route pages/api/ai.js forwards prompts to OpenAI using the API key.
- Do NOT commit your .env.local to any public repository.
- To deploy to Vercel: upload this project (or push to GitHub) and set OPENAI_API_KEY in Vercel project env vars.
