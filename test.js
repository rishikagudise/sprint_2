// change directory to current folder in terminal
// to run - node test.js

//import puppeteer

const puppeteer = require("puppeteer");

async function calendar_test() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5501/index.html");

  // Accept any alert
  page.on("dialog", async (dialog) => {
    console.log("Dialog message:", dialog.message());
    await dialog.accept();
  });

  // Wait for sign in button and click
  await page.waitForSelector("#signinbtn");
  await page.click("#signinbtn");

  await page.waitForSelector("#sign_in_email");
  await page.type("#sign_in_email", "gudiserishika@wisc.edu");
  await page.type("#sign_in_pass", "Sparkle123*");

  await page.click("#submit2");

  // Wait for dashboard button to appear and click
  await page.waitForSelector("#mydashboard");
  await page.click("#mydashboard");

  // Wait for the current day element to be visible
  await page.waitForSelector(".day.current-day");
  await page.click(".day.current-day");

  // Wait for modal input fields
  await page.waitForSelector("#event-name");

  await page.type("#event-name", "Alumni Meeting");
  await page.type("#start-time", "12:00PM");
  await page.type("#end-time", "1:00PM");
  await page.type("#event-desc", "Career opportunities");
  await page.type("#event-location", "Grainger library");

  await page.click(
    "#event-modal > div.modal-card > footer > button.button.is-success"
  );

  //this line allows the test to pause for a bit so users can actually see the event added on the calander
  await new Promise((r) => setTimeout(r, 5000));

  await browser.close();
}

calendar_test();

// //test 2 - adding profile
// async function add_profile_test() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 50,
//   });

//   const page = await browser.newPage();
//   await page.goto("http://127.0.0.1:5501/sprint_2/index.html#");

//   // Accept any alert
//   page.on("dialog", async (dialog) => {
//     console.log("Dialog message:", dialog.message());
//     await dialog.accept();
//   });

//   // Sign in
//   await page.click("#signinbtn");
//   await page.type("#sign_in_email", "puppeteer@gmail.com");
//   await page.type("#sign_in_pass", "puppeteer@gmail.com");
//   await page.click("#submit2");

//   // Navigate to Search Alumni page
//   await page.waitForSelector("#search_page");
//   await page.click("#search_page");

//   // Wait for content to load
//   await page.waitForSelector("#add_profile_btn");
//   await page.click("#add_profile_btn");

//   // Fill out the alumni form
//   await page.waitForSelector("#alumni_form");

//   await page.type("#first_name", "Test");
//   await page.type("#last_name", "Alumni");
//   await page.type("#company_name", "Test Company");
//   await page.type("#position_name", "Analyst");
//   await page.select("#industry_name", "Finance"); // match option value/text exactly
//   await page.type("#grad_yr", "2025");
//   await page.type("#email", "testalum@example.com");
//   await page.type("#degree", "BS");
//   await page.type("#major", "Finance");
//   await page.type("#city", "Madison");
//   await page.type("#state", "WI");
//   await page.type("#linkedin", "https://linkedin.com/in/testalum");

//   // Upload photo (skip this if not required for test — must be a valid path)
//   // const fileInput = await page.$("#profile_photo");
//   // await fileInput.uploadFile("path/to/local/test.jpg");

//   // Submit the form
//   await page.click("#add_profile_submit_btn");

//   // Wait to see result
//   await page.waitForTimeout(3000);

//   await browser.close();
// }

// add_profile_test();
