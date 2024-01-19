import { fetcher } from "./fetcher.js";

const getUserProfile = async (url) => {
  try {
    const response = await fetcher(url);

    return response;
  } catch (error) {
    console.log(error);
  }
};

const getUserRepos = async (url) => {
  try {
    const response = await fetcher(url);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export { getUserProfile, getUserRepos };
