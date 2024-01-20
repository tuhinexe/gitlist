import { getUserProfile, getUserRepos, handleActivePage } from "./helper.js";

let userName = "TuhinBar";
let pageNumber = 1;
let totalRepos;
let totalPages;
let perPage = 10;

const repoDropdown = document.querySelector(".repo-dropdown");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");
const resetBtn = document.querySelector("#reset-button");
const sortBtn = document.querySelector(".filter-container");
const searchFilter = document.querySelector("#search-filter");
const modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".close");
const repoDiv = document.querySelector(".repo-card");
const repoCard = document.querySelector(".repo-card-item");
const profileImage = document.querySelector("#profile-image");
const profileName = document.querySelector("#profile-name");
const profileBio = document.querySelector("#bio");
const profileLocation = document.querySelector("#profile-location");
const profileTwitter = document.querySelector("#profile-twitter");
const profileWebsite = document.querySelector("#profile-website");
const pageSection = document.querySelector(".page-button-container");
const pageBtnContainer = document.querySelector(".page-numbers");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

if (pageNumber === 1) {
  prevBtn.disabled = true;
} else {
  prevBtn.disabled = false;
}

if (pageNumber === totalPages) {
  nextBtn.disabled = true;
}

const renderPageNumbers = (totalRepoNumber) => {
  totalPages = Math.ceil(totalRepoNumber / perPage);

  if (totalPages <= 5) {
    pageBtnContainer.innerHTML = `
  
    ${Array.from({ length: totalPages }, (_, index) => {
      return `<button class="page-btn">${index + 1}</button>`;
    }).join("")}
    
    `;
  } else {
    if (pageNumber <= 3) {
      pageBtnContainer.innerHTML = `
      ${Array.from({ length: 3 }, (_, index) => {
        return `<button class="page-btn">${index + 1}</button>`;
      }).join("")}
      <span>...</span>
      <button class="page-btn">${totalPages}</button>
      `;
    } else if (pageNumber > 3 && pageNumber < totalPages - 2) {
      pageBtnContainer.innerHTML = `
      <button class="page-btn">1</button>
      <span>...</span>
      ${Array.from({ length: 3 }, (_, index) => {
        return `<button class="page-btn">${pageNumber - 2 + index}</button>`;
      }).join("")}
      <span>...</span>
      <button class="page-btn">${totalPages}</button>
      `;
    } else {
      pageBtnContainer.innerHTML = `
      <button class="page-btn">1</button>
      <span>...</span>
      ${Array.from({ length: 3 }, (_, index) => {
        return `<button class="page-btn">${totalPages - 2 + index}</button>`;
      }).join("")}
      `;
    }
  }

  handleActivePage(pageNumber);
};

const renderProfile = async (githubUser) => {
  const profile = await getUserProfile(`/users/${githubUser}`);
  if (profile.message === "Not Found") {
    modal.style.display = "flex";
    return;
  }

  profileImage.src = profile.avatar_url;
  profileName.textContent = profile.login;
  profileBio.textContent = profile.bio;
  profileLocation.textContent = profile.location;
  if (profile.twitter_username) {
    profileTwitter.textContent =
      `@` + profile.twitter_username || "Not Available";
    profileTwitter.href = `https://twitter.com/${profile.twitter_username}`;
  } else {
    profileTwitter.textContent = "Not Available";
    profileTwitter.href = profile.twitter_username
      ? `https://twitter.com/${profile.twitter_username}`
      : "";
  }
  profileWebsite.textContent = `https://github.com/${profile.login}`;
  profileWebsite.href = `https://github.com/${profile.login}`;

  totalRepos = profile.public_repos;
  console.log(totalRepos);
  if (totalRepos === 0) {
    repoDiv.style.display = "flex";
    repoDiv.innerHTML = `<h1 style="margin-inline:auto;">No Repositories Found</h1>`;
    pageSection.style.display = "none";
    return;
  } else {
    repoDiv.style.display = "grid";
    pageSection.style.display = "flex";

    renderPageNumbers(totalRepos);
  }
};

const renderRepos = async (url, sortBy) => {
  const repos = await getUserRepos(url);
  if (repos.message === "Not Found") {
    modal.style.display = "flex";
    return;
  }
  let sortedRepos = repos;

  if (sortBy === "stars") {
    sortedRepos.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    });
  } else if (sortBy === "forks") {
    sortedRepos.sort((a, b) => {
      return b.forks_count - a.forks_count;
    });
  } else if (sortBy === "repo") {
    pageSection.style.display = "none";
    repoDiv.innerHTML = `
    <a href=${repos.html_url} target="_blank" class="repo-card-item">
      <h3>${repos.name}</h3>
      <p>${repos.description || "No Description"}</p>
      <div class="topics-container">
        ${repos.topics
          .map((topic) => {
            return `<span class="topics">${topic}</span>`;
          })
          .join(" ")}
      </div>
      <div class="repo-card-footer">
        
        <div class="repo-star">
          <span>Stars :</span>
          <span>${repos.stargazers_count}</span>
        </div>
        <div class="repo-fork">
          <span>Forks :</span>
          <span>${repos.forks_count}</span>
        </div>
        <div class="repo-issues">
          <span>Issues :</span>
          <span>${repos.open_issues_count}</span>
        </div>
        <div class="repo-issues">
          <span>Language :</span>
          <span>${repos.language}</span>
        </div>
      </div>
    </a>`;
    console.log(repoDiv.firstElementChild);
    repoDiv.style.display = "flex";
    repoDiv.firstElementChild.style.width = "100%";
    return;
  } else {
    sortedRepos = repos.filter((repo) => {
      return repo.visibility === "public";
    });
  }

  repoDiv.innerHTML = sortedRepos
    .map((repo) => {
      console.log(repo);
      return `
    <a href=${repo.html_url} target="_blank" class="repo-card-item">
      <h3>${repo.name}</h3>
      <p>${repo.description || "No Description"}</p>
      <div class="topics-container">
        ${repo.topics
          .map((topic) => {
            return `<span class="topics">${topic}</span>`;
          })
          .join(" ")}
      </div>
      <div class="repo-card-footer">
        
        <div class="repo-star">
          <span>Stars :</span>
          <span>${repo.stargazers_count}</span>
        </div>
        <div class="repo-fork">
          <span>Forks :</span>
          <span>${repo.forks_count}</span>
        </div>
      </div>
    </a>`;
    })
    .join("");
};
const handlePreviosPage = () => {
  if (pageNumber === 1) {
    return;
  }
  pageNumber--;
  handleActivePage(pageNumber);
  renderRepos(
    `/users/${userName}/repos?per_page=${perPage}&page=${pageNumber}`
  );

  renderPageNumbers(totalRepos);
  prevBtn.disabled = pageNumber === 1;
  nextBtn.disabled = pageNumber === totalPages;
};

const handleNextPage = () => {
  if (pageNumber === totalPages) {
    return;
  }
  pageNumber++;
  handleActivePage(pageNumber);
  renderRepos(
    `/users/${userName}/repos?per_page=${perPage}&page=${pageNumber}`
  );

  renderPageNumbers(totalRepos);

  prevBtn.disabled = pageNumber === 1;
  nextBtn.disabled = pageNumber === totalPages;
};

const handlePageNumber = (e) => {
  pageNumber = parseInt(e.target.textContent);

  prevBtn.disabled = pageNumber === 1;
  nextBtn.disabled = pageNumber === totalPages;

  handleActivePage(pageNumber);
  renderRepos(
    `/users/${userName}/repos?per_page=${perPage}&page=${pageNumber}`
  );
  renderPageNumbers(totalRepos);
};

const handleNumberOfRepos = (e) => {
  perPage = e.target.value;
  renderPageNumbers(totalRepos);
  renderRepos(`/users/${userName}/repos?per_page=${e.target.value}&page=1`);
  renderPageNumbers(totalRepos);
};

const handleSearch = () => {
  console.log(searchFilter.value);
  if (searchFilter.value === "user") {
    userName = searchInput.value;
    renderProfile(userName);
    renderRepos(`/users/${userName}/repos?per_page=${perPage}&page=1`);
  } else {
    let repoName = searchInput.value;
    console.log(repoName);
    renderRepos(`/repos/${userName}/${repoName}`, "repo");
  }
};

const handleReset = () => {
  searchInput.value = "";
  userName = "TuhinBar";
  renderProfile(userName);
  renderRepos(`/users/${userName}/repos?per_page=${perPage}&page=1`);
};

const handleSort = (e) => {
  const sortType = e.target.value;
  if (sortType === "stars") {
    renderRepos(
      `/users/${userName}/repos?per_page=${perPage}&page=${pageNumber}`,
      "stars"
    );
  } else if (sortType === "forks") {
    renderRepos(
      `/users/${userName}/repos?per_page=${perPage}&page=${pageNumber}`,
      "forks"
    );
  } else {
    renderRepos(
      `/users/${userName}/repos?per_page=${perPage}&page=${pageNumber}`,
      "all"
    );
  }
};

modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
searchFilter.addEventListener("change", (e) => {
  let filterType = e.target.value;

  if (filterType === "user") {
    searchInput.placeholder = "Search User";
  } else {
    searchInput.placeholder = "Search Repository";
  }
});
searchBtn.addEventListener("click", handleSearch);
resetBtn.addEventListener("click", handleReset);
prevBtn.addEventListener("click", handlePreviosPage);
nextBtn.addEventListener("click", handleNextPage);
pageBtnContainer.addEventListener("click", handlePageNumber);
repoDropdown.addEventListener("change", handleNumberOfRepos);
sortBtn.addEventListener("change", handleSort);
window.addEventListener("load", () => {
  renderProfile(userName);
  renderRepos(`/users/${userName}/repos?per_page=${perPage}&page=1`);
});
