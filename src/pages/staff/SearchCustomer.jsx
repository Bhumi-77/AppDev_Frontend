import { useState } from "react";
import axios from "../../api/axios";

export default function SearchCustomer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await axios.get(`/customers/search?query=${query}`);
    setResults(res.data);
  };

  return (
    <div>
      <h2>Search Customer</h2>

      <input
        placeholder="Enter name/phone/vehicle"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {results.map((c) => (
        <div key={c.id}>
          <p>{c.name} - {c.phone}</p>
        </div>
      ))}
    </div>
  );
}