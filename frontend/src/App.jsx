import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

import "./App.css";

function App() {
  const [number_of_days, setNumber_of_days] = useState("");
  const [destination, setDestination] = useState("");
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
      if (!destination || !number_of_days) {
        alert("Please enter both destination and number of days.");
        return;
      }

      setLoading(true);
      setResultData(null);
      const response = await axios.post("http://localhost:3000/knitAI", {
        number_of_days,
        destination,
      });
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
      <h1 className="header">Travelopedia</h1>
      <h2 className="sub_header">
        A travel planner that helps you plan your trips in a jiffy!
      </h2>
      <div className="search_container">
        <label>
          Destination:
          <input
            type="text"
            className="destination_input input"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </label>
        <label>
          Number of Days:
          <input
            type="text"
            className="number_of_days_input input"
            value={number_of_days}
            onChange={(e) => setNumber_of_days(e.target.value)}
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
