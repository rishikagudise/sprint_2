//I don't think we need the default page to have a function associated with it???
// document.addEventListener("DOMContentLoaded", function () {
//   loadPage("home"); // Load the home page by default
// });

document
  .querySelector("#add_profile_submit_btn")
  .addEventListener("click", (event) => {
    console.log("hello");
    event.preventDefault();
    console.log("hello");

    // Gather other information
    let f_name = document.querySelector("#first_name").value;
    let l_name = document.querySelector("#last_name").value;
    let company = document.querySelector("#company_name").value;
    let position = document.querySelector("#position_name").value;
    let industry = document.querySelector("#industry_name").value;

    // Create a new profile card
    let alumCard = document.createElement("div");
    alumCard.classList.add("profile-card");
    alumCard.setAttribute("onclick", "loadPage('expanded')");

    alumCard.innerHTML = `
      <img src="test.jpg" class="profile-img" alt="Profile Image" />
      <h3>${f_name} ${l_name}</h3>
      <p>${company}</p>
      <p>${position}</p>
      <p>${industry}</p>
  `;

    // Append the card to the carousel
    document.querySelector("#carousel").appendChild(alumCard);

    // Reset the form after submitting
    document.querySelector("#alumni_form").reset();
    document.querySelector("#add_modal").classList.remove("is-active");
  });

//this requires the firebase database!
const add_alum_profile = (
  f_name,
  l_name,
  company,
  position,
  industry,
  profilePhoto
) => {
  let alum_profile = {
    First_Name: f_name,
    Last_Name: l_name,
    Company: company,
    Position: position,
    Industry: industry,
    Image: profilePhoto,
  };

  if (auth.currentUser != null) {
    //need to add stuff here once we set up firebase collections
  }
};

// Sign-Up Modal Functionality
let signupbtn = document.querySelector("#signupbtn");
signupbtn.addEventListener("click", () => {
  let sign_up_modal = document.querySelector("#smodal");

  // add the is-active to the model (function: add, class being added: is-active)
  sign_up_modal.classList.add("is-active");
});

// Sign-In Modal Functionality
let signinbtn = document.querySelector("#loginbtn");
signinbtn.addEventListener("click", () => {
  let sign_in_modal = document.querySelector("#smodal2");
  sign_in_modal.classList.add("is-active");
});

//Add Alumni Profile Modal Functionality
document.body.addEventListener("click", (event) => {
  if (event.target && event.target.id === "add_profile_btn") {
    let addProfileModal = document.querySelector("#add_modal");
    addProfileModal.classList.add("is-active");
  }
});

function loadPage(page) {
  let content = "";

  if (page === "dashboard") {
    style_html = `
      body {
        background: linear-gradient(to top, #f6e4da, #ffdde1, #f1b3bb, #ee9ca7);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .header {
        background-color: rgba(251, 244, 244, 0.9);
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .title-container {
        text-align: center;
        margin-top: 10vh;
      }

      .title {
        font-size: 3rem;
        font-weight: bold;
        color: white;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      }

      .subtitle {
        font-size: 1.3rem;
        color: white;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }

      .custom_signup {
        background-color: #ffdde1;
        border-color: #ee9ca7;
        color: rgb(252, 146, 146);
      }

      .custom_signup:hover {
        background-color: #ee9ca7;
      }

      .custom_login:hover {
        background-color: rgb(177, 168, 168);
      }

      .custom_db:hover {
        background-color: rgb(177, 168, 168);
      }

      .car-container {
        max-width: 660px;
        white-space: nonwrap;
        margin: auto;
        overflow: hidden;
        overflow-x: auto;
        position: relative;
        padding: 1rem;
        scroll-behavior: smooth;
        display: flex;
      }

      .car-container::-webkit-scrollbar {
        display: none;
        white-space: nonwrap;
        overflow-x: auto;
      }

      .profile-card {
        flex: 0 0 170px;
        /* display: flex; */
        /* flex-direction: column; */
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        width: 200px;
        margin: 10px;
        align-items: center;
        text-align: center;
        padding: 1rem;
        cursor: pointer;
      }

      .profile-card h3 {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
      }

      .profile-card p {
        font-size: 1rem;
        color: #666;
      }

      .profile-img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 10px;
      }

      .car-buttons {
        display: flex;
        justify-content: center;
        margin: top 10px;
      }

      .car-buttons button {
        background-color: #ee9ca7;
        color: white;
        border: none;
        padding: 10px 15px;
        margin: 5px;
        cursor: pointer;
        border-radius: 5px;
      }

      #add_profile_btn {
        background-color: #ffdde1;
        border-color: #ee9ca7;
        color: rgb(252, 146, 146);
        top: 10px;
        left: 10px;
        border-radius: 10px;
        max-width: 150px;
      }
      #add_profile_btn:hover {
        background-color: #fff9fa;
        color: #333;
      }
    `;
    content = `
    <a class="button mr-3 custom_db" id="add_profile_btn"
      ><b>Add a Profile</b></a
    >
    <div class="title-container">
      <h1 class="title">My Dashboard</h1>
      <p class="subtitle">
        Keep track of alumni profiles for future connections.
      </p>
    </div>

    <!-- Alumni Profile Carosoule Section! -->

    <div class="car-buttons">
      <button onclick="scrollLeft()">◀️</button>
      <button onclick="scrollRight()">▶️</button>
    </div>

    <div class="car-container" id="carousel">
      <!-- profile 1 -->
      <div class="profile-card" onclick="loadPage('expanded')">
        <img src="test.jpg" class="profile-img" />
        <h3>Jane Doe</h3>
        <p>Google</p>
      </div>
      <!-- profile 2 -->
      <div class="profile-card" onclick="loadPage('expanded')">
        <img src="test.jpg" class="profile-img" />
        <h3>Alice Walker</h3>
        <p>Meta</p>
      </div>
      <!-- profile 3 -->
      <div class="profile-card" onclick="loadPage('expanded')">
        <img src="test.jpg" class="profile-img" />
        <h3>Julia Jones</h3>
        <p>Instagram</p>
      </div>
      <!-- profile 4 -->
      <div class="profile-card" onclick="loadPage('expanded')">
        <img src="test.jpg" class="profile-img" />
        <h3>Lilly Porter</h3>
        <p>Facebook</p>
      </div>
      <!-- profile 5 -->
      <div class="profile-card" onclick="loadPage('expanded')">
        <img src="test.jpg" class="profile-img" />
        <h3>Angie Tufts</h3>
        <p>Amazon</p>
      </div>
    </div>
      `;

    // Log the button to see if it's being correctly loaded
    let addProfileBtn = document.querySelector("#add_profile_btn");
    console.log("add_profile_btn", addProfileBtn);

    let addProfileModal = document.querySelector("#add_modal");
    console.log("addProfileModal:", addProfileModal);
  } else if (page === "search_page") {
    style_html = `
      body {
        background: linear-gradient(to top, #f6e4da, #ffdde1, #f1b3bb, #ee9ca7);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 20px;
      }

      .header {
        background-color: rgba(251, 244, 244, 0.9);
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }

      .profile-container {
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        max-width: 900px;
        margin: auto;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }

      .profile-photo {
        flex: 1 1 250px;
        text-align: center;
      }

      .profile-photo img {
        width: 100%;
        max-width: 250px;
        height: auto;
        border-radius: 15px;
        object-fit: cover;
      }

      .profile-details {
        flex: 2 1 500px;
      }

      .profile-details h2 {
        color: #ee9ca7;
        font-weight: bold;
      }

      .info-section {
        margin-bottom: 20px;
      }

      .info-section h3 {
        color: #ee9ca7;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .contact-info a {
        color: #ee9ca7;
        text-decoration: underline;
      }

      .custom_find_btn {
        background-color: #ffdde1;
        border-color: #ee9ca7;
        color: rgb(241, 106, 106);
      }

      .filter-section {
        background-color: rgba(255, 255, 255, 0.9);
        padding: 15px;
        border-radius: 10px;
      }
    `;
    content = `
        <form id="searchbar" class="mb-6 mx-6" action="#">
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input
            id="searchInpt"
            type="text"
            class="input"
            placeholder="Search"
          />
        </div>
        <div class="control">
          <button id="searchBtn" class="button custom_find_btn">
            <b>Find!</b>
          </button>
        </div>
      </div>
    </form>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="columns is-multiline">
        <!-- grad yr filter -->
        <div class="column is-one-quarter">
          <label class="label">Graduation Year</label>
          <div class="select is-fullwidth">
            <select>
              <option>All</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
            </select>
          </div>
        </div>
        <!-- majors filter -->
        <div class="column is-one-quarter">
          <label class="label">Major/Field of Study</label>
          <div class="select is-fullwidth">
            <select>
              <option>All</option>
              <option>Business Administration</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Computer Science</option>
              <option>Data Science</option>
            </select>
          </div>
        </div>
        <!-- location filter -->
        <div class="column is-one-quarter">
          <label class="label">Location</label>
          <input
            class="input"
            type="text"
            placeholder="Enter a City or State"
          />
        </div>
        <div class="column is-one-quarter">
          <label class="label">Industry</label>
          <div class="select is-fullwidth">
            <select>
              <option>All</option>
              <option>Medicine</option>
              <option>Finance</option>
              <option>Technology</option>
              <option>Health Care</option>
              <option>Enviornment</option>
              <option>Education</option>
            </select>
          </div>
        </div>
        <div class="column is-one-quarter">
          <label class="label">Company Name</label>
          <input type="text" class="input" placeholder="Enter a company name" />
        </div>
      </div>
    </div>
    <!-- Results Section -->
    &nbsp;&nbsp;&nbsp;&nbsp;
    <header><b>Results: </b></header>
      `;
  } else if (page == "expanded") {
    //might need to change this method of dynamically gathering information because we prolly
    //make use of firebase db.
    document
      .getElementById("carousel")
      .addEventListener("click", function (event) {
        let card = event.target.closest(".profile-card");
        if (card) {
          let full_name = card.querySelector("h3").textContent;
          let company = card.querySelector("p").textContent;
          load_expanded(full_name, company);
        }
      });
  }
  document.getElementById("main_content").innerHTML = content;
  document.querySelector("style").innerHTML = style_html;
}

function load_expanded(name, company) {
  style_html = `
    body {
        background: linear-gradient(to top, #f6e4da, #ffdde1, #f1b3bb, #ee9ca7);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 20px;
      }

      .header {
        background-color: rgba(251, 244, 244, 0.9);
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }

      .profile-container {
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        max-width: 900px;
        margin: auto;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }

      .profile-photo {
        flex: 1 1 250px;
        text-align: center;
      }

      .profile-photo img {
        width: 100%;
        max-width: 250px;
        height: auto;
        border-radius: 15px;
        object-fit: cover;
      }

      .profile-details {
        flex: 2 1 500px;
      }

      .profile-details h2 {
        color: #ee9ca7;
        font-weight: bold;
      }

      .info-section {
        margin-bottom: 20px;
      }

      .info-section h3 {
        color: #ee9ca7;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .contact-info a {
        color: #ee9ca7;
        text-decoration: underline;
      }
    `;

  content = `
      <!-- Alumni Profile -->
    <div class="profile-container">
      <!-- Profile Picture -->
      <div class="profile-photo">
        <img src="test.jpg" alt="Alumni Photo" />
      </div>

      <!-- Alumni Details -->
      <div class="profile-details">
        <h2>${name}</h2>
        <p><strong>Company:</strong>${company}</p>
        <p><strong>Position:</strong> Senior Data Analyst</p>

        <div class="info-section">
          <h3>About</h3>
          <p>
            Passionate about data-driven decision-making, Jane has over 5 years
            of experience in analytics, driving business growth through insights
            and innovation.
          </p>
        </div>

        <div class="info-section">
          <h3>Work Experience</h3>
          <ul>
            <li>
              <strong>Senior Data Analyst</strong> at Tech Innovations Inc.
              (2020 - Present)
            </li>
            <li>
              <strong>Data Analyst</strong> at Analytics Co. (2017 - 2020)
            </li>
          </ul>
        </div>

        <div class="info-section">
          <h3>Education</h3>
          <p>
            Bachelor's in Business Analytics, University of XYZ (2013 - 2017)
          </p>
        </div>

        <div class="info-section contact-info">
          <h3>Contact</h3>
          <p>
            Email:
            <a href="mailto:jane.doe@example.com">jane.doe@example.com</a>
          </p>
          <p>
            LinkedIn:
            <a href="https://www.linkedin.com">linkedin.com/in/janedoe</a>
          </p>
        </div>
      </div>
    </div>
    `;
  document.getElementById("main_content").innerHTML = content;
  document.querySelector("style").innerHTML = style_html;
}

function scrollLeft() {
  let carousel = document.getElementById("carousel");
  if (carousel) {
    carousel.scrollLeft -= 270; // Force move left
  }
}
function scrollRight() {
  document
    .getElementById("carousel")
    .scrollBy({ left: 215, behavior: "smooth" });
}
