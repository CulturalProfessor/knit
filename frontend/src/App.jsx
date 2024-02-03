import { useState } from "react";
import Markdown from "react-markdown";
import axios from "axios";

import "./App.css";

function App() {
  const [kid_name, setKid_name] = useState("");
  const [theme, setTheme] = useState("");
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formattedString = (response) => {
    const formattedString = response
      .replace(/\\n/g, "\n")
      .replace(/\*\*/g, "")
      .replace(/\\'/g, "'");
    return formattedString;
  };
  const handleSearch = async () => {
    try {
      if (!kid_name || !theme) {
        alert("Please Enter Kid Name and Theme");
        return;
      }

      setLoading(true);
      setResultData(null);
      const response = await axios.post(
        "https://knit-delta.vercel.app/knitAI",
        {
          theme: theme,
          kid_name: kid_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      const Text = formattedString(response.data.responseText);
      setResultData(Text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="header">Storify</h1>
      <h2 className="sub_header">
        Generate Bedtime Stories for your Kids using AI 📚 in a jiffy !
      </h2>
      <div className="search_container">
        <label>
          Kid Name:
          <input
            type="text"
            className="kid_name_input"
            value={kid_name}
            onChange={(e) => setKid_name(e.target.value)}
          />
        </label>
        <label>
          Theme:
          <input
            type="text"
            className="theme_input"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {loading && <div className="loader">Loading...</div>}

      {resultData && (
        <div className="result_container">
          <Markdown className="result_text">{resultData}</Markdown>
        </div>
      )}
    </div>
  );
}

export default App;
