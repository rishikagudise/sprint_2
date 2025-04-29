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

//what happens when the auth changes (signed in vs no one signed in states)
auth.onAuthStateChanged((user) => {
  if (user) {
    r_e("navbar-user-info").innerHTML = user.email;
  } else {
    r_e("navbar-user-info").innerHTML = "Not signed in";
  }
});

// User Sign Up
document
  .getElementById("sign_up_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect user input
    const firstName = document.getElementById("member_first_name").value.trim();
    const lastName = document.getElementById("member_last_name").value.trim();
    const email = document.getElementById("sign_up_email").value.trim();
    const password = document.getElementById("sign_up_pass").value.trim();

    // Validate input (optional, but recommended)
    if (!firstName || !lastName || !email || !password) {
      alert("All fields are required. Please complete the form.");
      return;
    }

    // User object for Firestore
    const memberObj = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password, // Store hashed passwords in production
      role: "", // Default role
      active_status: false, // Require admin approval
      events_attended: null, // Default value
      join_date: firebase.firestore.Timestamp.now(), // Current timestamp
    };

    try {
      // Check if the email is already in use
      const signInMethods = await auth.fetchSignInMethodsForEmail(email);
      if (signInMethods.length > 0) {
        alert("Email is already in use. Please use a different email.");
        return;
      }

      // Create the user with Firebase Auth
      await auth.createUserWithEmailAndPassword(email, password);

      // Add user to Firestore
      await db.collection("Members").doc(email).set(memberObj);

      // Notify user and reset form
      alert(
        `Account created successfully! An admin must approve your account before you can access the site.`
      );
      document.getElementById("sign_up_form").reset();
      document.getElementById("smodal").classList.remove("is-active");
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(`Sign-up failed: ${error.message}`);
    }
  });

// // Close modal when clicking on the background for Sign Up
// r_e("smodal").addEventListener("click", (e) => {
//   if (e.target.classList.contains("modal-background")) {
//     r_e("smodal").classList.remove("is-active");
//     r_e("sign_up_form").reset();
//   }
// });

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
              //test
              // console.log(firstName, lastName);
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

// Update Calendar
let currentDate = new Date();
let userEvents = []; // This will store the current user's event documents

// Render Calendar
async function renderCalendar() {
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

  // Empty slots before the first day
  for (let i = 0; i < firstDay; i++) {
    let emptyDiv = document.createElement("div");
    calendarDays.appendChild(emptyDiv);
  }

  // Render days
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

    // Render Events for this day
    const formattedDate = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    userEvents.forEach((event) => {
      if (event.date === formattedDate) {
        let eventDiv = document.createElement("div");
        eventDiv.innerText = `${event.start_time} - ${event.end_time}: ${event.name}`;
        eventDiv.classList.add("event");

        eventDiv.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm("Do you want to delete this event?")) {
            deleteEvent(event.id);
          }
        });

        dayDiv.appendChild(eventDiv);
      }
    });

    calendarDays.appendChild(dayDiv);
  }
}

// Open Event Modal
function openModal(day) {
  const modal = document.getElementById("event-modal");
  modal.classList.add("is-active");
  r_e("event-day").value = day;
  r_e("start-time").value = "";
  r_e("end-time").value = "";
  r_e("event-desc").value = "";
  r_e("event-name").value = "";
  r_e("event-location").value = "";
  r_e("event-is-virtual").checked = false;
}

// Close Modal
function closeModal() {
  document.getElementById("event-modal").classList.remove("is-active");
}

// Save Event
async function saveEvent() {
  let day = r_e("event-day").value;
  let startTime = r_e("start-time").value;
  let endTime = r_e("end-time").value;
  let description = r_e("event-desc").value;
  let name = r_e("event-name").value;
  let location = r_e("event-location").value;
  let isVirtual = r_e("event-is-virtual").checked;

  if (!startTime || !endTime || !description || !name || !location) {
    alert("Please fill in all fields.");
    return;
  }

  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  try {
    // Add event to Events collection
    const eventRef = await db.collection("Events").add({
      date: formattedDate,
      start_time: startTime,
      end_time: endTime,
      description: description,
      is_virtual: isVirtual,
      location: location,
      name: name,
      participants: [auth.currentUser.uid], // We'll use uid here
    });

    // Add event to user's Member document
    const memberSnapshot = await db
      .collection("Members")
      .where("email", "==", auth.currentUser.email)
      .limit(1)
      .get();

    if (!memberSnapshot.empty) {
      const memberDoc = memberSnapshot.docs[0];
      await memberDoc.ref.update({
        events_attended: firebase.firestore.FieldValue.arrayUnion(eventRef),
      });
    }
    alert("Event successfully added!");
    closeModal();
    loadUserEvents();
  } catch (error) {
    console.error("Error saving event: ", error);
    alert("Failed to save event.");
  }
}

// Load User's Events
async function loadUserEvents() {
  if (!auth.currentUser) return;

  try {
    const memberSnapshot = await db
      .collection("Members")
      .where("email", "==", auth.currentUser.email)
      .limit(1)
      .get();

    if (!memberSnapshot.empty) {
      const memberDoc = memberSnapshot.docs[0];
      const eventsRefs = memberDoc.data().events_attended || [];
      userEvents = [];

      for (let ref of eventsRefs) {
        const eventDoc = await ref.get();
        if (eventDoc.exists) {
          userEvents.push({
            id: eventDoc.id,
            ...eventDoc.data(),
          });
        }
      }

      renderCalendar();
    }
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

// Delete Event
async function deleteEvent(eventId) {
  if (!auth.currentUser) return;

  try {
    // Delete event document
    await db.collection("Events").doc(eventId).delete();

    // Remove event reference from user's Member document
    const memberSnapshot = await db
      .collection("Members")
      .where("email", "==", auth.currentUser.email)
      .limit(1)
      .get();

    if (!memberSnapshot.empty) {
      const memberDoc = memberSnapshot.docs[0];
      const eventRef = db.collection("Events").doc(eventId);
      await memberDoc.ref.update({
        events_attended: firebase.firestore.FieldValue.arrayRemove(eventRef),
      });
    }

    alert("Event deleted!");
    loadUserEvents();
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}

// Initialize Calendar After Sign In
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserEvents();
  }
});

// Month Navigation
function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();

// //test commit
// function deleteEvent(key, index) {
//   events[key].splice(index, 1);
// }

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
            <label class="label">Event Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                id="event-name"
                placeholder="Event Title"
              />
            </div>
          </div>
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
                placeholder="Meeting Details"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Location</label>
            <div class="control">
              <input
                class="input"
                type="text"
                id="event-location"
                placeholder="Zoom / Office Room"
              />
            </div>
          </div>
          <div class="field">
            <label class="checkbox">
              <input type="checkbox" id="event-is-virtual" />
              Virtual Event
            </label>
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
    //to actually load the signed in member's saved alumni profiles into their dashboard
    setTimeout(async () => {
      const carousel = document.getElementById("carousel");

      if (!auth.currentUser) return;

      // Get the logged-in member document
      const memberSnapshot = await db
        .collection("Members")
        .where("email", "==", auth.currentUser.email)
        .limit(1)
        .get();

      if (!memberSnapshot.empty) {
        const memberDoc = memberSnapshot.docs[0];
        const savedRefs = memberDoc.data().saved_alumni || [];

        if (savedRefs.length === 0) {
          carousel.innerHTML =
            "<p>No saved alumni yet. Go add some from the Search page!</p>";
          return;
        }

        // Loop through the saved references
        for (let ref of savedRefs) {
          const alumDoc = await ref.get(); // get actual alumni doc
          const alumData = alumDoc.data();

          const fullName = `${alumData.first_name} ${alumData.last_name}`;
          const image = alumData.photo_url || "test.png";
          const company = alumData.company || "Unknown Company";

          const card = document.createElement("div");
          card.classList.add("profile-card");
          card.setAttribute("onclick", `loadPage('expanded', '${alumDoc.id}')`);

          card.innerHTML = `
            <img src="${image}" class="profile-img" />
            <h3>${fullName}</h3>
            <p>${company}</p>
          `;

          carousel.appendChild(card);
        }
      } else {
        carousel.innerHTML = "<p>⚠️ Member profile not found.</p>";
      }
    }, 0);
  } else if (page === "search_page") {
    db.collection("Alumni")
      .get()
      .then((querySnapshot) => {
        const resultsContainer = document.getElementById("alumni-results");

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const fullName = `${data.first_name} ${data.last_name}`;
          const company = data.company || "Unknown Company";
          const image = "test.png"; // fallback image

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
    <br></br>
        <form id="searchbar" class="mb-6 mx-6">
  <!-- Search + Submit -->
  <div class="field is-grouped">
    <div class="control is-expanded">
      <input
        id="searchInpt"
        type="text"
        class="input"
        placeholder="Search by First and/or Last Name"
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
            <option>2019</option>
            <option>2018</option>
            <option>2017</option>
            <option>2016</option>
            <option>2015</option>
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

      <!-- University -->
      <div class="column is-one-quarter">
        <label class="label">University</label>
        <input
          id="university_filter"
          class="input"
          type="text"
          placeholder="Enter a University"
        />
      </div>

      <!-- State -->
      <div class="column is-one-quarter">
        <label class="label">State</label>
        <input
          id="state_filter"
          class="input"
          type="text"
          placeholder="Enter a State"
        />
      </div>

      <!-- City -->
      <div class="column is-one-quarter">
        <label class="label">City</label>
        <input
          id="city_filter"
          class="input"
          type="text"
          placeholder="Enter a City"
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
      const searchBar = r_e("searchInpt").value;
      const gradYear = r_e("grad_filter").value;
      const major = r_e("major_filter").value;
      const university = r_e("university_filter").value.toLowerCase();
      const state = r_e("state_filter").value.toLowerCase();
      const city = r_e("city_filter").value.toLowerCase();
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
              searchBar &&
              !(
                data.first_name &&
                data.first_name.toLowerCase().includes(searchBar.toLowerCase())
              ) &&
              !(
                data.last_name &&
                data.last_name.toLowerCase().includes(searchBar.toLowerCase())
              )
            ) {
              match = false;
            }

            if (
              state &&
              !(data.state && data.state.toLowerCase().includes(state))
            ) {
              match = false;
            }

            if (
              university &&
              !(
                data.university &&
                data.university.toLowerCase().includes(university)
              )
            ) {
              match = false;
            }

            if (
              city &&
              !(data.city && data.city.toLowerCase().includes(city))
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
              const image = "test.png";

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
    load_expanded(docId);
  } else if (page === "admin_dashboard") {
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
      .custom_columns {
        border-radius: 10px;
        margin: 10px;
        align-items: center;
        text-align: center;
        }
        `;
    content = `<div>
      <p class="has-text-danger">
        To create the first admin account, manually update the Members collection
        by changing the role field to "admin" for a selected user. This will
        grant them admin privileges.
      </p>
    </div>
<br>
    <a class="button mr-3 custom_db" id="add_profile_btn"
      ><b>Add an Alumni to the Database!</b></a
    >
<br>
    <!-- Add Profile Modal? -->
    <div class="modal" id="add_modal">
      <div class="modal-background" id="modalbg"></div>
      <div class="modal-content has-background-white p-4 model-aes">
        <p class="is-size-4 has-text-weight-semibold has-text-centered">
          Add an Alumni Profile to the Site!
        </p>
        <form id="alumni_form">
          <!-- first name -->
          <div class="field">
            <label class="label">First Name</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_first_name"
                type="text"
                placeholder="first name"
              />
            </div>
          </div>
          <!-- last name (text) -->
          <div class="field">
            <label class="label">Last Name</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_last_name"
                type="text"
                placeholder="last name"
              />
            </div>
          </div>
          <!-- about (text) -->
          <div class="field">
            <label class="label">About/Bio</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_bio"
                type="text"
                placeholder="About the Alum"
              />
            </div>
          </div>
          <!-- company name (text) -->
          <div class="field">
            <label class="label">Company</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_company"
                type="text"
                placeholder="company name"
              />
            </div>
          </div>
          <!-- position (text) -->
          <div class="field">
            <label class="label">Position</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_position"
                type="text"
                placeholder="position"
              />
            </div>
          </div>
          <!-- major (text) -->
          <div class="field">
            <label class="label">Major</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_major"
                type="text"
                placeholder="major"
              />
            </div>
          </div>

          <!-- University (text) -->
          <div class="field">
            <label class="label">University</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_university"
                type="text"
                placeholder="major"
              />
            </div>
          </div>

          <!-- industry (select) -->
          <div class="field">
            <label class="label">Industry</label>
            <div class="select is-fullwidth">
              <select id="alum_industry">
                <option>Medicine</option>
                <option>Finance</option>
                <option>Technology</option>
                <option>Health Care</option>
                <option>Enviornment</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <!-- degree (select) -->
          <div class="field">
            <label class="label">Degree</label>
            <div class="select is-fullwidth">
              <select id="alum_degree">
                <option>BBA</option>
                <option>BA</option>
                <option>BS</option>
                <option>B.Eng</option>
                <option>B.S.N</option>
                <option>B.Des</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <!-- city (text) -->
          <div class="field">
            <label class="label">City</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_city"
                type="text"
                placeholder="city"
              />
            </div>
          </div>
          <!-- state (text) -->
          <div class="field">
            <label class="label">State</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_state"
                type="text"
                placeholder="state"
              />
            </div>
          </div>
          <!-- graduation year (number) -->
          <div class="field">
            <label class="label">Graduation Year</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_grad_yr"
                type="number"
                placeholder="year"
              />
            </div>
          </div>
          <!-- email (text) -->
          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_email"
                type="text"
                placeholder="email"
              />
            </div>
          </div>
          <!-- linkedin (text) -->
          <div class="field">
            <label class="label">Linkedin</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="alum_linkedin"
                type="text"
                placeholder="linkedin"
              />
            </div>
          </div>
          <!-- profile photos -->
          <div class="field m-4">
            <label class="label">Profile Photo:</label>
            <div class="control">
              <input
                id="profile_photo"
                class="input"
                type="file"
                placeholder="Choose a file"
              />
            </div>
          </div>

          <p class="has-text-centered">
            <!-- submit and reset buttons -->
            <input
              type="submit"
              value="Submit"
              id="add_profile_submit_btn"
              class="button in-primary"
            />
            <input type="reset" value="Reset" class="button is-bold" />
          </p>
        </form>
      </div>
    </div>

    <div id="auth" class="m-2 p-3">
      <div class="columns">
        <!-- Unnapproved users -->
        <div class="column custom_columns has-background-danger-light">
          <h1 class="title">Unapproved Users</h1>
          <div id="unregistered_users"></div>
        </div>

        <!-- Non-admin users to remove-->
        <div class="column custom_columns has-background-danger-light">
          <h1 class="title">Non-Admin Users (Remove)</h1>
          <div id="registered_users_remove"></div>
        </div>

        <!-- Non-admin users to promote-->
        <div class="column custom_columns has-background-danger-light">
          <h1 class="title">Non-Admin Users (Promote)</h1>
          <div id="registered_users_promote"></div>
        </div>

        <!-- admin users -->
        <div class="column custom_columns has-background-danger-light">
          <h1 class="title">Admin Users</h1>
          <div id="admin_users"></div>
        </div>
      </div>
    </div>`;

    document.getElementById("main_content").innerHTML = content;
    document.querySelector("style").innerHTML = style_html;
    // ADMIN DASHBOARD CODE
    // fill the admin dashboard
    fetchUsers();

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
      let bio = r_e("alum_bio").value;
      let company = r_e("alum_company").value;
      let position = r_e("alum_position").value;
      let major = r_e("alum_major").value;
      let university = r_e("alum_university").value;
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
        bio: bio,
        company: company,
        current_position: position,
        major: major,
        university: university,
        industry: industry,
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
        alert("alum added successfully");
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
    <img src="test.png" class="profile-img" alt="Profile Image" />
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
      const company = data.company || "NA";
      const position = data.current_position || "NA";
      const about = data.bio || "NA"; //need to add this in the doc???
      const city = data.city || "NA";
      const state = data.state || "NA";
      const education = `${data.degree} at ${data.university}` || "NA";
      const major = data.major || "NA";
      const grad_yr = data.graduation_year || "NA";
      const industry = data.industry || "NA";
      const email = data.contact_info.email || "NA";
      const linkedin = data.contact_info.linkedin || "NA";
      const image = "test.png";

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
            <h3>Industry</h3>
            <p>${industry}</p>
          </div>

          <div class="info-section">
            <h3>About</h3>
            <p>${about}</p>
          </div>

          <div class="info-section">
            <h3>Location</h3>
            <p>${city},${state}</p>
          </div>

          <div class="info-section">
            <h3>Education</h3>
            <p>${education}</p>
          </div>

          <div class="info-section">
            <h3>Major</h3>
            <p>${major}</p>
          </div>
          
          <div class="info-section">
            <h3>Graduation Year</h3>
            <p>${grad_yr}</p>
          </div>

          <div class="info-section contact-info">
            <h3>Contact</h3>
            <p>Email: <a href="mailto:${email}">${email}</a></p>
            <p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin}</a></p>
          </div>
          <div class="info-section mt-4">
  <button class="button is-info" id="saveAlumBtn" data-id="${docId}">
    ➕ Add to Dashboard
  </button>
  <button class="button is-danger is-light ml-2" id="removeAlumBtn" data-id="${docId}" style="display: none;">
    ❌ Remove from Dashboard
  </button>
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
          <br />
    <button class="button is-success mt-2" id="saveNotesBtn">Save Notes</button>
        </div>
      </section>
    `;
      //^^^we need to make the notes section only available/show up for logged in members?
      //^^^also do we need to add firestore functionality to the notes section so they are saved?
      //^^^lastly, do we need to make the notes only appear if they are in the members dashboard? (I think yes!)
      //^^^so with the notes, they need to appear for logged in members and only for alumni cards in the dashboard!
      document.getElementById("main_content").innerHTML = content;
      document.querySelector("style").innerHTML = style_html;
      setTimeout(async () => {
        const saveBtn = document.getElementById("saveAlumBtn");
        const removeBtn = document.getElementById("removeAlumBtn");
        const alumniId = docId;

        if (!auth.currentUser) return;

        const memberSnapshot = await db
          .collection("Members")
          .where("email", "==", auth.currentUser.email)
          .limit(1)
          .get();

        if (!memberSnapshot.empty) {
          const memberDoc = memberSnapshot.docs[0];
          const memberRef = memberDoc.ref;
          const savedAlumni = memberDoc.data().saved_alumni || [];

          const alumniRef = db.collection("Alumni").doc(alumniId);

          // Check if this alumniRef is already saved
          const alreadySaved = savedAlumni.some((ref) => ref.id === alumniId);

          if (alreadySaved) {
            saveBtn.disabled = true;
            saveBtn.innerText = "✔️ Already Saved";
            removeBtn.style.display = "inline-block";
          }

          // Save button
          saveBtn.addEventListener("click", async () => {
            if (alreadySaved) return;

            await memberRef.update({
              saved_alumni: firebase.firestore.FieldValue.arrayUnion(alumniRef),
            });

            alert("✅ Alumni saved to your dashboard!");
            saveBtn.disabled = true;
            saveBtn.innerText = "✔️ Added";
            removeBtn.style.display = "inline-block";
          });

          // Remove button
          removeBtn.addEventListener("click", async () => {
            await memberRef.update({
              saved_alumni:
                firebase.firestore.FieldValue.arrayRemove(alumniRef),
            });

            // ALSO remove the related notes - if there are any!
            const notesSnapshot = await memberRef
              .collection("notes")
              .where("alumni_id", "==", alumniId)
              .get();

            const batch = db.batch();
            notesSnapshot.forEach((noteDoc) => {
              batch.delete(noteDoc.ref);
            });

            await batch.commit();

            alert("Alumni removed and associated notes deleted!");

            // Reload the expanded page to reflect the change
            load_expanded(alumniId);
          });
        } else {
          alert("Member profile not found.");
        }
        const notesArea = r_e("notes");
        const saveNotesBtn = r_e("saveNotesBtn");

        if (!auth.currentUser) {
          notesArea.disabled = true;
          saveNotesBtn.style.display = "none";
          return;
        }

        if (!memberSnapshot.empty) {
          const memberDoc = memberSnapshot.docs[0];
          const memberRef = memberDoc.ref;
          const savedAlumni = memberDoc.data().saved_alumni || [];

          const alumniRef = db.collection("Alumni").doc(docId);

          const alreadySaved = savedAlumni.some((ref) => ref.id === docId);

          if (!alreadySaved) {
            notesArea.disabled = true;
            saveNotesBtn.style.display = "none";
            return;
          }

          //Keep track of whether a note document already exists
          let existingNoteDocId = null;

          const notesSnapshot = await memberRef
            .collection("notes")
            .where("alumni_id", "==", docId)
            .limit(1)
            .get();

          if (!notesSnapshot.empty) {
            const noteDoc = notesSnapshot.docs[0];
            notesArea.value = noteDoc.data().content;
            existingNoteDocId = noteDoc.id; // 💡 save the document ID for future updating
          }

          //Save notes
          saveNotesBtn.addEventListener("click", async () => {
            const newNoteContent = notesArea.value;

            if (existingNoteDocId) {
              //Update existing document
              await memberRef
                .collection("notes")
                .doc(existingNoteDocId)
                .update({
                  content: newNoteContent,
                });
            } else {
              //Add new document if none exists yet
              const newDocRef = await memberRef.collection("notes").add({
                alumni_id: docId,
                content: newNoteContent,
              });

              existingNoteDocId = newDocRef.id; // update for future saves
            }

            alert("Notes saved successfully!");
          });
        }
      }, 0);
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

// on auth state changed
auth.onAuthStateChanged((user) => {
  if (user) {
    // Query Firestore for the document with the matching email
    db.collection("Members")
      .where("email", "==", user.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.role === "admin") {
              // when signed in, sign up/in buttons disappear and sign out button appears
              r_e("signupbtn").classList.add("is-hidden");
              r_e("signinbtn").classList.add("is-hidden");
              r_e("signoutbtn").classList.remove("is-hidden");
              // when signed in, dashboard, search page, and admin dashboard no longer hidden
              r_e("mydashboard").classList.remove("is-hidden");
              r_e("search_page").classList.remove("is-hidden");
              r_e("admin_dashboard").classList.remove("is-hidden");
            } else if (userData.active_status === false) {
              alert(
                "Please contact an admin to become approved before you can access site content."
              );
              // Sign out the user
              auth
                .signOut()
                .then(() => {
                  console.log(
                    "User has been signed out due to inactive status."
                  );
                })
                .catch((error) => {
                  console.error("Error signing out user:", error);
                });
            } else {
              // when signed in, sign up/in buttons disappear and sign out button appears
              r_e("signupbtn").classList.add("is-hidden");
              r_e("signinbtn").classList.add("is-hidden");
              r_e("signoutbtn").classList.remove("is-hidden");
              // when signed in, dashboard and search page no longer hidden
              r_e("mydashboard").classList.remove("is-hidden");
              r_e("search_page").classList.remove("is-hidden");
            }
          });
        } else {
          console.error(
            "No matching document found for the authenticated user."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching user document:", error);
      });
  } else {
    console.log("No user is signed in.");
  }
});

// admin dashboard global functions
// functions to change user status
function approveUser(userId) {
  db.collection("Members")
    .doc(userId)
    .update({ active_status: true })
    .then(() => {
      alert("User approved!");
      fetchUsers(); // Refresh the dashboard
    })
    .catch((error) => {
      console.error("Error approving user:", error);
    });
}

function makeAdmin(userId) {
  db.collection("Members")
    .doc(userId)
    .update({ role: "admin" })
    .then(() => {
      alert("User promoted to Admin!");
      fetchUsers(); // Refresh the dashboard
    })
    .catch((error) => {
      console.error("Error promoting user to Admin:", error);
    });
}

function removeUser(userId) {
  db.collection("Members")
    .doc(userId)
    .update({ active_status: false })
    .then(() => {
      alert("User removed.");
      fetchUsers(); // Refresh the dashboard
    })
    .catch((error) => {
      console.error("Error removing user:", error);
    });
}

function revokeAdmin(userId) {
  db.collection("Members")
    .doc(userId)
    .update({ role: "" })
    .then(() => {
      alert("Admin rights revoked!");
      fetchUsers(); // Refresh the dashboard
    })
    .catch((error) => {
      console.error("Error revoking Admin rights:", error);
    });
}

// fill admin dashboard
function renderUsers(snapshot, elementId, action) {
  const container = document.getElementById(elementId);
  let html = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const firstName = data.first_name || "Unknown";
    const lastName = data.last_name || "Unknown";
    const email = data.email || "No Email";
    const role = data.role || "None"; // Fallback if role is undefined

    html += `
            <p>${firstName} ${lastName} (${email})</p>
            <button onclick="${action}('${doc.id}')">${action.replace(
      /([A-Z])/g,
      " $1"
    )}</button>
          `;
  });

  container.innerHTML = html || "<p>No users found.</p>";
}

function fetchUsers() {
  // Clear the columns before re-rendering
  document.getElementById("unregistered_users").innerHTML = "";
  document.getElementById("registered_users_remove").innerHTML = "";
  document.getElementById("registered_users_promote").innerHTML = "";
  document.getElementById("admin_users").innerHTML = "";

  // Fetch unapproved users
  db.collection("Members")
    .where("active_status", "==", false)
    .get()
    .then((snapshot) =>
      renderUsers(snapshot, "unregistered_users", "approveUser")
    );

  // Fetch non-admin users to remove
  db.collection("Members")
    .where("active_status", "==", true)
    .where("role", "==", "")
    .get()
    .then((snapshot) => {
      renderUsers(snapshot, "registered_users_remove", "removeUser");
    });

  // Fetch non-admin users to promote
  db.collection("Members")
    .where("active_status", "==", true)
    .where("role", "==", "")
    .get()
    .then((snapshot) => {
      renderUsers(snapshot, "registered_users_promote", "makeAdmin");
    });

  // Fetch admin users
  db.collection("Members")
    .where("role", "==", "admin")
    .get()
    .then((snapshot) => renderUsers(snapshot, "admin_users", "revokeAdmin"));
}
