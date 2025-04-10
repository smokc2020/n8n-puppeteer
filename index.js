// const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,  // Đặt thành true nếu không cần hiển thị trình duyệt
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Đường dẫn Chrome
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://facebook.com');

    console.log("Trang đã load thành công!");

    await page.screenshot({ path: 'screenshot.png' });

    // await browser.close();
})();
