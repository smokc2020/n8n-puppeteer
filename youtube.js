import puppeteer from "puppeteer";

const searchTermCLI = process.argv.length >= 3 ? process.argv[2] : 'Volbeat';

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Để thấy trình duyệt chạy
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://youtube.com/', { waitUntil: 'networkidle0' });

    await page.waitForSelector('input[name="search_query"]', { timeout: 5000 });
    await page.type('input[name="search_query"]', searchTermCLI, { delay: 100 });
    // Click vào nút tìm kiếm
    await page.waitForSelector('button[aria-label="Search"]', { timeout: 5000 });
    await page.click('button[aria-label="Search"]');
    
    await page.screenshot({ path: 'youtube-home.png' });

    // await browser.close();
})();
