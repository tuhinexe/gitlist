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

const handleActivePage = (pageNumber) => {
  console.log(pageNumber);
  const pageBtnContainer = document.querySelectorAll(".page-btn");

  if (pageNumber === 1) {
    pageBtnContainer[0].classList.add("active");

    pageBtnContainer.forEach((btn) => {
      if (btn.textContent !== "1") {
        btn.classList.remove("active");
      }
    });
  } else {
    pageBtnContainer.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.textContent === pageNumber.toString()) {
        console.log(btn.textContent);
        btn.classList.add("active");
      }
    });
  }
};

export { getUserProfile, getUserRepos, handleActivePage };
