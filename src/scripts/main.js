import { getUserProfile, getUserRepos } from "./helper.js";

let pageNumber = 1;
let isPageEnd = false;

const repoDiv = document.querySelector(".repo-card");
const profileImage = document.querySelector("#profile-image");
const profileName = document.querySelector("#profile-name");
const profileBio = document.querySelector("#bio");
const profileLocation = document.querySelector("#profile-location");
const profileTwitter = document.querySelector("#profile-twitter");
const profileWebsite = document.querySelector("#profile-website");

const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

const renderProfile = async () => {
  const profile = await getUserProfile("/users/TuhinBar");
  console.log(profile);
  profileImage.src = profile.avatar_url;
  profileName.textContent = profile.login;
  profileBio.textContent = profile.bio;
  profileLocation.textContent = profile.location;
  profileTwitter.textContent =
    `@` + profile.twitter_username || "Not Available";
  profileTwitter.href = `https://twitter.com/${profile.twitter_username}`;
  profileWebsite.textContent = `https://github.com/${profile.login}`;
  profileWebsite.href = `https://github.com/${profile.login}`;
};

const renderRepos = async (url) => {
  const repos = await getUserRepos(url);
  const sortedRepos = repos.filter((repo) => {
    return repo.visibility === "public";
  });
  //   console.log(sortedRepos);

  if (sortedRepos.length === 0) {
    isPageEnd = true;
    repoDiv.innerHTML = `
    <div class="repo-card__item__title">
      <h3>You are at the end of the list</h3>
    </div>
    `;
  } else {
    repoDiv.innerHTML = sortedRepos
      .map((repo) => {
        console.log(repo.topics);
        return `
      <div class="repo-card-item">
        <h3>${repo.name}</h3>
        <p>${repo.description || "No Description"}</p>
        <div class="topics-container">
          ${repo.topics
            .map((topic) => {
              return `<span class="topics">${topic}</span>`;
            })
            .join(" ")}
        </div>
      </div>`;
      })
      .join("");
  }
};

const handlePreviosPage = () => {
  // console.log(pageNumber);
  if (pageNumber === 1) return;
  pageNumber--;
  renderRepos(`/users/TuhinBar/repos?per_page=10&page=${pageNumber}`);
};

const handleNextPage = () => {
  // console.log(pageNumber);
  if (isPageEnd) return;
  pageNumber++;
  renderRepos(`/users/TuhinBar/repos?per_page=10&page=${pageNumber}`);
};

prevBtn.addEventListener("click", handlePreviosPage);
nextBtn.addEventListener("click", handleNextPage);

window.addEventListener("load", () => {
  renderProfile();
  renderRepos("/users/TuhinBar/repos?per_page=10&page=1");
});
