//I don't think we need the default page to have a function associated with it???
// document.addEventListener("DOMContentLoaded", function () {
//   loadPage("home"); // Load the home page by default
// });

// a function to return elements by their IDs
function r_e(id) {
  return document.querySelector(`#${id}`);
}

// function for message bar messages
function configure_message_bar(msg) {
  r_e("message_bar").innerHTML = msg;

  // show message bar
  r_e("message_bar").classList.remove("is-hidden");

  // hide the message bar again in 3 seconds and clear its content
  setTimeout(() => {
    r_e("message_bar").classList.add("is-hidden");
    r_e("message_bar").innerHTML = "";
  }, 3000);
}

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

// User Sign Up

r_e("sign_up_form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let first_name = r_e("member_first_name").value;
  let last_name = r_e("member_last_name").value;
  let email = r_e("sign_up_email").value;
  let password = r_e("sign_up_pass").value;

  let member_obj = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    role: "",
    active_status: true,
    events_attended: null,
    saved_alumni: [],
    join_date: firebase.firestore.Timestamp.now(),
  };

  try {
    // Check if the email is already in use
    await auth.fetchSignInMethodsForEmail(email);
    // If no error occurs, it means the email is not in use
  } catch (error) {
    // Handle the case where the email is already in use
    alert("Email is already in use. Please try again.");
    return; // Return to stop further execution
  }

  try {
    // Attempt to create the user with the actual password
    await auth.createUserWithEmailAndPassword(email, password);
    //adding information to the db.collection - "Members
    await db.collection("Members").add(member_obj);
    // User creation successful
    alert(`Account ${auth.currentUser.email} has been created`);
    //show the currently signed up/signed in user's info
    const infoBox = document.getElementById("navbar-user-info");
    infoBox.innerHTML = `
    <div>
      <span class="has-text-weight-semibold">${first_name} ${last_name}</span><br>
    </div>
  `;
    // Reset the form
    r_e("sign_up_form").reset();
    // Close the modal
    r_e("smodal").classList.remove("is-active");
  } catch (error) {
    // Handle other errors during user creation
    alert(`${error}`);
    r_e("smodal").classList.remove("is-active");
    r_e("sign_up_form").reset();
    return; // Return to stop further execution
  }

  // Reset the form (double check the form ID)
  r_e("sign_up_form").reset();
});

// Close modal when clicking on the background for Sign Up
r_e("smodal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-background")) {
    r_e("smodal").classList.remove("is-active");
    r_e("sign_up_form").reset();
  }
});

// User Sign In

r_e("sign_in_form").addEventListener("submit", (e) => {
  e.preventDefault();

  // find email and pass from the form
  let email = r_e("sign_in_email").value;
  let pass = r_e("sign_in_pass").value;

  // sign user in
  auth
    .signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      const userEmail = userCredential.user.email;
      db.collection("Members")
        .where("email", "==", userEmail)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const firstName = data.first_name;
              const lastName = data.last_name;
              //show the currently signed up/signed in user's info in nav-bar
              const infoBox = document.getElementById("navbar-user-info");
              infoBox.innerHTML = `
              <div>
                <span class="has-text-weight-semibold">${firstName} ${lastName}</span><br>
              </div>
            `;
              //test
              console.log(firstName, lastName);
            });
          } else {
            console.warn(
              "No matching member document found for email:",
              userEmail
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching member data:", error);
        });

      // notify user they are signed in
      alert(`You are now signed in!`);

      // reset the sign in form
      r_e("sign_in_form").reset();

      // hide the modal
      r_e("smodal2").classList.remove("is-active");
      r_e("smodal2").classList.add("is-hidden");

      // hide and clear messages
      r_e("simessages").classList.add("is-hidden");
      r_e("simessages").innerHTML = "";
    })
    // need to fix these errors eventually ik they're not right
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/user-mismatch") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML = "Incorrect credentials";
      } else if (errorCode == "auth/user-not-found") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML = "User not found";
      } else if (errorCode == "auth/internal-error") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML = "Incorrect credentials";
      } else if (errorCode == "auth/invalid-credential") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML = "Invalid credentials";
      } else if (errorCode == "auth/wrong-password") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML = "The password is incorrect";
      } else if (errorCode == "auth/account-exists-with-different-credential") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML =
          "The account exists but with a different credential";
      } else if (errorCode == "auth/null-user") {
        r_e("simessages").classList.remove("is-hidden");
        r_e("simessages").innerHTML = "Null user";
      } else {
        r_e("sumessages").classList.remove("is-hidden");
        r_e("sumessages").innerHTML = "There was an error.";
      }
    });
});

// User Sign Out
r_e("signoutbtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    // tell user they signed out
    alert("You are now signed out!");
    // force refresh to update onauthstatechanged
    setTimeout(() => {
      location.reload();
    }, 3000);
  });
});

// Close modal when clicking on the background for Sign In
r_e("smodal2").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-background")) {
    r_e("smodal2").classList.remove("is-active");
    r_e("sign_in_form").reset();
  }
});

// //on auth state change
auth.onAuthStateChanged((user) => {
  if (user) {
    // when signed in, sign up/in buttons disappear and sign out button appears
    r_e("signupbtn").classList.add("is-hidden");
    r_e("signinbtn").classList.add("is-hidden");
    r_e("signoutbtn").classList.remove("is-hidden");
  }
});

// Sign-Up Modal Functionality
let signupbtn = document.querySelector("#signupbtn");
signupbtn.addEventListener("click", () => {
  let sign_up_modal = document.querySelector("#smodal");

  // add the is-active to the model (function: add, class being added: is-active)
  sign_up_modal.classList.add("is-active");
});

// Sign-In Modal Functionality
let signinbtn = document.querySelector("#signinbtn");
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

r_e("alumni_form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let first_name = r_e("alum_first_name").value;
  let last_name = r_e("alum_last_name").value;
  let company = r_e("alum_company").value;
  let position = r_e("alum_position").value;
  let major = r_e("alum_major").value;
  let industry = r_e("alum_industry").value;
  let degree = r_e("alum_degree").value;
  let city = r_e("alum_city").value;
  let state = r_e("alum_state").value;
  let grad_yr = r_e("alum_grad_yr").value;
  let email = r_e("alum_email").value;
  let linkedin = r_e("alum_linkedin").value;

  let alum_obj = {
    first_name: first_name,
    last_name: last_name,
    company: company,
    current_position: position,
    major: major,
    industry,
    industry,
    degree: degree,
    city: city,
    state: state,
    graduation_year: grad_yr,
    contact_info: {
      email: email,
      linkedin: linkedin,
    },
  };

  //actually inserting into the db collection - alumni!!!
  try {
    await db.collection("Alumni").add(alum_obj);
  } catch (error) {
    alert(`${error}`);
    return;
  }
  r_e("alumni_form").reset();

  // Create a new profile card
  let alumCard = document.createElement("div");
  alumCard.classList.add("profile-card");
  alumCard.setAttribute("onclick", "loadPage('expanded')");

  alumCard.innerHTML = `
    <img src="test.jpg" class="profile-img" alt="Profile Image" />
    <h3>${first_name} ${last_name}</h3>
    <p>${company}</p>
`;

  // Append the card to the carousel
  document.querySelector("#carousel").appendChild(alumCard);

  // Reset the form after submitting
  document.querySelector("#alumni_form").reset();
  document.querySelector("#add_modal").classList.remove("is-active");
});

// Close modal when clicking on the background for Add Alumni Profile Modal
r_e("add_modal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-background")) {
    r_e("add_modal").classList.remove("is-active");
    r_e("alumni_form").reset();
  }
});

// r_e("searchbar").addEventListener("submit", (e) => {
//   e.preventDefault();
//   console.log("clicked");

// const gradYear = r_e("grad_filter").value;
// const major = r_e("major_filter").value;
// const location = r_e("location_filter").value.toLowerCase();
// const industry = r_e("industry_filter").value;
// const company = r_e("company_filter").value.toLowerCase();

// const resultsContainer = r_e("alumni-results");
// resultsContainer.innerHTML = ""; // Clear existing results

// db.collection("Alumni")
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       let match = true;

//       if (gradYear !== "All" && data.graduation_year != gradYear)
//         match = false;
//       if (major !== "All" && data.major !== major) match = false;
//       if (industry !== "All" && data.industry !== industry) match = false;

//       if (
//         location &&
//         !(data.city && data.city.toLowerCase().includes(location)) &&
//         !(data.state && data.state.toLowerCase().includes(location))
//       ) {
//         match = false;
//       }

//       if (
//         company &&
//         !(data.company && data.company.toLowerCase().includes(company))
//       ) {
//         match = false;
//       }

//       if (match) {
//         const fullName = `${data.first_name} ${data.last_name}`;
//         const image = "test.jpg"; // replace if photo URL available

//         const cardHTML = `
//           <div class="profile-card column is-one-quarter" onclick="loadPage('expanded', '${
//             doc.id
//           }')">
//             <img src="${image}" class="profile-img" />
//             <h3>${fullName}</h3>
//             <p>${data.company || "Unknown Company"}</p>
//           </div>
//         `;
//         resultsContainer.innerHTML += cardHTML;
//       }
//     });
//   });
//});

// Update Calendar
let currentDate = new Date();
let events = {};

function renderCalendar() {
  const calendarDays = document.getElementById("calendar-days");
  const monthYear = document.getElementById("month-year");
  calendarDays.innerHTML = "";

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  let today = new Date();

  monthYear.innerText = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  let firstDay = new Date(year, month, 1).getDay();
  let lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    let emptyDiv = document.createElement("div");
    calendarDays.appendChild(emptyDiv);
  }

  for (let day = 1; day <= lastDate; day++) {
    let dayDiv = document.createElement("div");
    dayDiv.innerText = day;
    dayDiv.classList.add("day");
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      dayDiv.classList.add("current-day");
    }
    dayDiv.addEventListener("click", () => openModal(day));

    let key = `${year}-${month}-${day}`;
    if (events[key]) {
      events[key].forEach((eventObj, index) => {
        let eventDiv = document.createElement("div");
        eventDiv.innerText = `${eventObj.startTime} - ${eventObj.endTime}: ${eventObj.description}`;
        eventDiv.classList.add("event");
        eventDiv.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm("Do you want to delete this event?")) {
            deleteEvent(key, index);
          }
        });
        dayDiv.appendChild(eventDiv);
      });
    }

    calendarDays.appendChild(dayDiv);
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}
function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function openModal(day) {
  document.getElementById("event-day").value = day;
  document.getElementById("start-time").value = "";
  document.getElementById("end-time").value = "";
  document.getElementById("event-desc").value = "";
  document.getElementById("event-modal").classList.add("is-active");
}

function closeModal() {
  document.getElementById("event-modal").classList.remove("is-active");
}

function saveEvent() {
  let day = document.getElementById("event-day").value;
  let startTime = document.getElementById("start-time").value;
  let endTime = document.getElementById("end-time").value;
  let description = document.getElementById("event-desc").value;

  if (!startTime || !endTime || !description)
    return alert("Please fill in all fields.");

  let key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
  if (!events[key]) events[key] = [];
  events[key].push({ startTime, endTime, description });
  closeModal();
  renderCalendar();
}

function deleteEvent(key, index) {
  events[key].splice(index, 1);
  renderCalendar();
}

renderCalendar();

function loadPage(page, docId = null) {
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

      .custom_signin:hover {
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

      // #add_profile_btn {
      //   background-color: #ffdde1;
      //   border-color: #ee9ca7;
      //   color: rgb(252, 146, 146);
      //   top: 10px;
      //   left: 10px;
      //   border-radius: 10px;
      //   max-width: 150px;
      // }
      // #add_profile_btn:hover {
      //   background-color: #fff9fa;
      //   color: #333;
      // }

      .calendar-container {
        width: 80%;
        margin: auto;
        padding: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      }

      .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
      }

      .day {
        padding: 10px;
        min-height: 100px;
        border: 1px solid #ddd;
        cursor: pointer;
        background: #f9f9f9;
        border-radius: 5px;
      }

      .day:hover {
        background: #f5f5f5;
      }

      .current-day {
        background:rgb(70, 139, 217);
        color: white;
        font-weight: bold;
      }

      .event {
        background:rgb(255, 226, 111);
        padding: 2px;
        margin-top: 5px;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
      }

      .modal {
        display: none;
      }
    `;
    content = `
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

    <!-- Calendar -->
    <section class="section">
      <div class="container calendar-container">
        <div class="level">
          <button class="button is-small is-info" onclick="prevMonth()">
            &#9665;
          </button>
          <h2 id="month-year" class="title is-4 has-text-black"></h2>
          <button class="button is-small is-info" onclick="nextMonth()">
            &#9655;
          </button>
        </div>
        <div class="calendar-days" id="calendar-days"></div>
      </div>
    </section>

    <!-- Calendar Modal -->
    <div class="modal" id="event-modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Event</p>
          <button
            class="delete"
            aria-label="close"
            onclick="closeModal()"
          ></button>
        </header>
        <section class="modal-card-body">
          <input type="hidden" id="event-day" />
          <div class="field">
            <label class="label">Start Time</label>
            <div class="control">
              <input
                class="input"
                type="text"
                id="start-time"
                placeholder="10:00 AM"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">End Time</label>
            <div class="control">
              <input
                class="input"
                type="text"
                id="end-time"
                placeholder="11:00 AM"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <input
                class="input"
                type="text"
                id="event-desc"
                placeholder="Meeting"
              />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" onclick="saveEvent()">Save</button>
          <button class="button" onclick="closeModal()">Cancel</button>
        </footer>
      </div>
    </div>
      `;

    document.getElementById("main_content").innerHTML = content;
    document.querySelector("style").innerHTML = style_html;
    renderCalendar();
  } else if (page === "search_page") {
    db.collection("Alumni")
      .get()
      .then((querySnapshot) => {
        const resultsContainer = document.getElementById("alumni-results");

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const fullName = `${data.first_name} ${data.last_name}`;
          const company = data.company || "Unknown Company";
          const image = "test.jpg"; // fallback image

          const cardHTML = `
  <div class="profile-card column is-one-quarter" data-id="${doc.id}" onclick="loadPage('expanded', '${doc.id}')">
    <img src="${image}" class="profile-img" />
    <h3>${fullName}</h3>
    <p>${company}</p>
  </div>
`;

          resultsContainer.innerHTML += cardHTML;
        });
      })
      .catch((error) => {
        console.error("Error loading alumni:", error);
      });
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

      .info-section {
        margin-bottom: 20px;
      }

      .info-section h3 {
        color: #ee9ca7;
        font-weight: bold;
        margin-bottom: 5px;
      }

      #add_profile_btn:hover {
        background-color: #fff9fa;
        color: #333;
      }
      #add_profile_btn:hover {
        background-color: #fff9fa;
        color: #333;
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
    <a class="button mr-3 custom_db" id="add_profile_btn"
      ><b>Add a Profile</b></a
    >
    <br></br>
        <form id="searchbar" class="mb-6 mx-6">
  <!-- Search + Submit -->
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
      <input
        type="submit"
        value="Search!"
        id="searchBtn"
        class="button custom_find_btn"
      />
    </div>
  </div>

  <!-- Filter Section -->
  <div class="filter-section">
    <div class="columns is-multiline">
      <!-- Graduation Year -->
      <div class="column is-one-quarter">
        <label class="label">Graduation Year</label>
        <div class="select is-fullwidth">
          <select id="grad_filter">
            <option>All</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
          </select>
        </div>
      </div>

      <!-- Major -->
      <div class="column is-one-quarter">
        <label class="label">Major/Field of Study</label>
        <div class="select is-fullwidth">
          <select id="major_filter">
            <option>All</option>
            <option>Accounting</option>
            <option>Finance</option>
            <option>Marketing</option>
            <option>Computer Science</option>
            <option>Data Science</option>
          </select>
        </div>
      </div>

      <!-- Location -->
      <div class="column is-one-quarter">
        <label class="label">Location</label>
        <input
          id="location_filter"
          class="input"
          type="text"
          placeholder="Enter a City or State"
        />
      </div>

      <!-- Industry -->
      <div class="column is-one-quarter">
        <label class="label">Industry</label>
        <div class="select is-fullwidth">
          <select id="industry_filter">
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

      <!-- Company -->
      <div class="column is-one-quarter">
        <label class="label">Company Name</label>
        <input
          id="company_filter"
          type="text"
          class="input"
          placeholder="Enter a company name"
        />
      </div>
    </div>
  </div>
</form>

    <!-- Results Section -->
    &nbsp;&nbsp;&nbsp;&nbsp;
    <header><b>Results: </b></header>
    <div id="alumni-results" class="columns is-multiline mt-3"></div>
      `;

    document.getElementById("main_content").innerHTML = content;
    document.querySelector("style").innerHTML = style_html;
    r_e("searchbar").addEventListener("submit", (e) => {
      e.preventDefault();
      const gradYear = r_e("grad_filter").value;
      const major = r_e("major_filter").value;
      const location = r_e("location_filter").value.toLowerCase();
      const industry = r_e("industry_filter").value;
      const company = r_e("company_filter").value.toLowerCase();
      const resultsContainer = r_e("alumni-results");
      resultsContainer.innerHTML = ""; // Clear existing results
      console.log("clicked");
      db.collection("Alumni")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            let match = true;

            if (gradYear !== "All" && data.graduation_year != gradYear)
              match = false;
            if (major !== "All" && data.major !== major) match = false;
            if (industry !== "All" && data.industry !== industry) match = false;

            if (
              location &&
              !(data.city && data.city.toLowerCase().includes(location)) &&
              !(data.state && data.state.toLowerCase().includes(location))
            ) {
              match = false;
            }

            if (
              company &&
              !(data.company && data.company.toLowerCase().includes(company))
            ) {
              match = false;
            }

            if (match) {
              const fullName = `${data.first_name} ${data.last_name}`;
              const image = "test.jpg"; // replace if photo URL available

              const cardHTML = `
          <div class="profile-card column is-one-quarter" onclick="loadPage('expanded', '${
            doc.id
          }')">
            <img src="${image}" class="profile-img" />
            <h3>${fullName}</h3>
            <p>${data.company || "Unknown Company"}</p>
          </div>
        `;
              resultsContainer.innerHTML += cardHTML;
            }
          });
        });
    });
  } else if (page == "expanded") {
    //might need to change this method of dynamically gathering information because we prolly
    //make use of firebase db.
    // document
    //   .getElementById("carousel")
    //   .addEventListener("click", function (event) {
    //     let card = event.target.closest(".profile-card");
    //     if (card) {
    //       let full_name = card.querySelector("h3").textContent;
    //       let company = card.querySelector("p").textContent;
    //       load_expanded(full_name, company);
    //     }
    //   });
    load_expanded(docId);
  }
}

function load_expanded(docId) {
  db.collection("Alumni")
    .doc(docId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.error("Alumni profile not found.");
        return;
      }

      const data = doc.data();
      const name = `${data.first_name} ${data.last_name}`;
      const company = data.company || "Unknown Company";
      const position = data.current_position || "Senior Data Analyst";
      const about =
        data.bio || "Passionate about data-driven decision-making..."; //need to add this in the doc???
      const education =
        data.degree ||
        "Bachelor's in Business Analytics, University of XYZ (2013 - 2017)";
      const email = data.contact_info.email || "jane.doe@example.com";
      const linkedin = data.contact_info.linkedin || "https://www.linkedin.com";
      const image = data.photo_url || "test.jpg";

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
      <div class="profile-container">
        <div class="profile-photo">
          <img src="${image}" alt="${name}" />
        </div>
        <div class="profile-details">
          <h2>${name}</h2>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Position:</strong> ${position}</p>

          <div class="info-section">
            <h3>About</h3>
            <p>${about}</p>
          </div>

          <div class="info-section">
            <h3>Education</h3>
            <p>${education}</p>
          </div>

          <div class="info-section contact-info">
            <h3>Contact</h3>
            <p>Email: <a href="mailto:${email}">${email}</a></p>
            <p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin}</a></p>
          </div>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <h1 class="title">Notes</h1>
          <textarea
            id="notes"
            class="textarea"
            placeholder="Write your notes here..."
            rows="10"
          ></textarea>
        </div>
      </section>
    `;
      //^^^we need to make the notes section only available/show up for logged in members?
      //^^^also do we need to add firestore functionality to the notes section so they are saved?
      //^^^lastly, do we need to make the notes only appear if they are in the members dashboard? (I think yes!)
      //^^^so with the notes, they need to appear for logged in members and only for alumni cards in the dashboard!
      document.getElementById("main_content").innerHTML = content;
      document.querySelector("style").innerHTML = style_html;
    }); // <- this closes .then()
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
