// change directory to current folder in terminal
//go to sprint_2 directory!!!
// in another terminal window, cd into sprint_2 folder again and then type this to run test: node test.js

//IMPORTANT NOTE - Make sure to clear out the calander and dashboard before testing!
//Username - gudiserishika@wisc.edu
//Password - Sparkle123*

//import puppeteer

const puppeteer = require("puppeteer");

async function calendar_test() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.goto("https://wibalumnisearch.web.app/#");

  // Accept any alert
  page.on("dialog", async (dialog) => {
    console.log("Dialog message:", dialog.message());
    await dialog.accept();
  });

  await new Promise((r) => setTimeout(r, 2000)); // wait 2 seconds

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

//test 2 - adding profile to user dashboard
async function add_profile_test() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.goto("https://wibalumnisearch.web.app/#");

  // Accept any alert
  page.on("dialog", async (dialog) => {
    console.log("Dialog message:", dialog.message());
    await dialog.accept();
  });

  // Sign in
  await page.click("#signinbtn");
  await page.type("#sign_in_email", "gudiserishika@wisc.edu");
  await page.type("#sign_in_pass", "Sparkle123*");
  await page.click("#submit2");

  // Navigate to Search Alumni page
  await page.waitForSelector("#search_page");
  await page.click("#search_page");

  // Fill out the alumni form
  await page.waitForSelector("#searchbar");

  await page.type("#grad_filter", "2019");
  await page.type("#company_filter", "PwC");

  await new Promise((r) => setTimeout(r, 1000));

  await page.waitForSelector("#searchBtn");
  await page.click("#searchBtn");

  await new Promise((r) => setTimeout(r, 2000));

  await page.waitForSelector(".profile-card");
  await page.click(".profile-card");

  await new Promise((r) => setTimeout(r, 2000));

  await page.waitForSelector("#saveAlumBtn");
  await page.click("#saveAlumBtn");

  await new Promise((r) => setTimeout(r, 2000));

  await page.waitForSelector("#mydashboard");
  await page.click("#mydashboard");

  // Wait to see result
  await new Promise((r) => setTimeout(r, 5000));

  await browser.close();
}

//TO RUN THE ACTUAL TESTS - DO ONE AT A TIME !!!! (comment one out while doing the other!!!)

calendar_test();
// add_profile_test();
