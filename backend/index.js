import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const TOKEN = process.env.TOKEN;
const TIMEOUT = process.env.TIMEOUT;

const app = new Express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
  })
);

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/knitAI", async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Content-Type", "application/json");
    console.log("Request body:", req.body);
    const url = "https://api.getknit.ai/v1/router/run";
    const { kid_name, theme } = req.body;
    const data = {
      messages: [
        {
          role: "system",
          content:
            "You are the world's most renowned storyteller, having enchanted young audiences with countless bedtime tales. Your storytelling prowess is unmatched, and you possess a vast imagination to craft magical and captivating narratives for children.",
        },
        {
          role: "user",
          content: `Craft a heartwarming bedtime story featuring a young character named ${kid_name}. The story should revolve around the theme of ${theme}. Be creative, add elements of magic, and make it an enchanting experience for the young listener.`,
        },
      ],
      model: {
        name: "openai/gpt-4-1106-preview",
        params: {
          max_tokens: 1000,
        },
      },
      variables: [
        {
          name: "kid_name",
          value: kid_name,
        },
        {
          name: "theme",
          value: theme,
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": AUTH_TOKEN,
      },
      body: JSON.stringify(data),
      timeout: TIMEOUT,
    });
    console.log("Response status:", response.body);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      res.status(response.status).json(result);
    } else {
      const responseText = await response.text();
      console.error("Non-JSON response content:", responseText);
      res.status(500).json({ error: "Unexpected response format" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.options("/knitAI", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://knit-uvnz.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.status(200).send();
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
