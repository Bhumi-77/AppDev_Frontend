import axios from "axios";

export default axios.create({
  // Point it to your actual running port from the logs
  baseURL: "https://localhost:7007/api", 
});