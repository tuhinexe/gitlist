import { config } from "./config.js";

const API_KEY = config.GITHUB_TOKEN || "";

const fetcher = async (url) => {
  try {
    const response = await fetch(`https://api.github.com${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { fetcher };
