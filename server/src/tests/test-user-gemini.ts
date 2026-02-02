import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

async function testUserCode() {
  console.log('Testing user provided Gemini pattern...');
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",




      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey || '',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "Return a JSON object with a 'greeting' field saying hello" }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }

        }),
      }

    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error body:", err);
      return;
    }

    const data = await response.json();
    console.log("Success! Response:", data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Test Error:", error);
  }
}

testUserCode();
