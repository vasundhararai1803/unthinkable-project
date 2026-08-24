import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const keyMatch = envFile.match(/GROQ_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : '';

async function getModels() {
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data.data.map(m => m.id), null, 2));
}

getModels();
