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
   allowedHeaders:"*"
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
    const { number_of_days, destination } = req.body;
    const data = {
      messages: [
        {
          role: "system",
          content:
            "Imagine you are the best travel planner in the world, who has traveled all the countries and knows everything about popular places to go, hidden gems, the best time to go, cultural places, outdoor activities, romantic destinations and activities, historic locations, and museums, wildlife attractions, cuisines to try and things and places to shop.",
        },
        {
          role: "user",
          content: `I am planning to have a ${number_of_days}-day trip to ${destination}. We like to visit popular locations as well as offbeat hidden gems. We prefer medium-paced travel and are interested in visiting cultural places, seeing historic monuments, relaxing on beaches, interacting with wildlife, shopping for souvenirs, and enjoying nightlife. \nPlease plan a day-wise itinerary for the trip along with places to visit and explain the reason to visit each location. Provide the output in list format with details including: \n1. Day (e.g., Day 1)\n2. Primary city for the day\n3. Up to 4 locations to be covered day-wise in the following format:\n- Location title\n- Time to spend\n- Opening hours\n- Distance from the previous location.`,
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
          name: "number_of_days",
          value: `${number_of_days}`,
        },
        {
          name: "destination",
          value: `${destination}`,
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
