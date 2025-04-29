// change directory to current folder in terminal
// to run - node test.js

// import puppeteer

const puppeteer = require("puppeteer");

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
