// change directory to current folder in terminal
// to run - node test.js

// import puppeteer

const puppeteer = require("puppeteer");

//test 1 - calendar
async function calendar_test() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  // go to the site to be tested
  const page = await browser.newPage();

  await page.goto("http://127.0.0.1:5501/sprint_2/index.html#"); // replace with published url

  // listen for alertt popup and accept
  page.on("dialog", async (dialog) => {
    console.log("Dialog message:", dialog.message());
    await dialog.accept();
  });

  // click on the sign in button
  await page.click("#signinbtn");

  // provide email and password to sign in
  await page.type("#sign_in_email", "puppeteer@gmail.com");
  await page.type("#sign_in_pass", "puppeteer@gmail.com");

  // click on the submit button
  await page.click("#submit2");

  // click on dashboard
  await page.click("#mydashboard");

  // click on date
  await page.click(".day.current-day");

  // add event
  await page.type("#event-name", "Alumni Meeting");
  await page.type("#start-time", "12:00PM");
  await page.type("#end-time", "1:00PM");
  await page.type("#event-desc", "Career opportunities");
  await page.type("#event-location", "Grainger library");
  await page.click(
    "#event-modal > div.modal-card > footer > button.button.is-success"
  );

  // delete event
  await new Promise((r) => setTimeout(r, 2500));
  await page.click(".day.current-day .event");
}

calendar_test();

//test 2 - adding profile
async function add_profile_test() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5501/sprint_2/index.html#");

  // Accept any alert
  page.on("dialog", async (dialog) => {
    console.log("Dialog message:", dialog.message());
    await dialog.accept();
  });

  // Sign in
  await page.click("#signinbtn");
  await page.type("#sign_in_email", "puppeteer@gmail.com");
  await page.type("#sign_in_pass", "puppeteer@gmail.com");
  await page.click("#submit2");

  // Navigate to Search Alumni page
  await page.waitForSelector("#search_page");
  await page.click("#search_page");

  // Wait for content to load
  await page.waitForSelector("#add_profile_btn");
  await page.click("#add_profile_btn");

  // Fill out the alumni form
  await page.waitForSelector("#alumni_form");

  await page.type("#first_name", "Test");
  await page.type("#last_name", "Alumni");
  await page.type("#company_name", "Test Company");
  await page.type("#position_name", "Analyst");
  await page.select("#industry_name", "Finance"); // match option value/text exactly
  await page.type("#grad_yr", "2025");
  await page.type("#email", "testalum@example.com");
  await page.type("#degree", "BS");
  await page.type("#major", "Finance");
  await page.type("#city", "Madison");
  await page.type("#state", "WI");
  await page.type("#linkedin", "https://linkedin.com/in/testalum");

  // Upload photo (skip this if not required for test — must be a valid path)
  // const fileInput = await page.$("#profile_photo");
  // await fileInput.uploadFile("path/to/local/test.jpg");

  // Submit the form
  await page.click("#add_profile_submit_btn");

  // Wait to see result
  await page.waitForTimeout(3000);

  await browser.close();
}

add_profile_test();
