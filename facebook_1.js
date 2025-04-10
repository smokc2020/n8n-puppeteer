const puppeteer = require('puppeteer');

const postContent = process.argv[2];
const pageUrls = process.argv.slice(3);

(async () => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const userDataPath = 'C:\\Users\\smokc\\AppData\\Local\\Google\\Chrome\\User Data\\1';

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        userDataDir: userDataPath
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(20000);

    for (const url of pageUrls) {
        try {
            console.log(`➡ Đang đăng bài lên: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Click vào ô "Bạn đang nghĩ gì?" để mở popup
            await page.waitForSelector('div[role="button"][aria-label="Tạo bài viết"]', { timeout: 10000 });
            await page.click('div[role="button"][aria-label="Tạo bài viết"]');

            // Chờ popup mở ra
            await page.waitForSelector('div[contenteditable="true"]', { timeout: 10000 });

            // Nhập nội dung bài viết
            await page.type('div[contenteditable="true"]', postContent, { delay: 50 });

            // Click vào nút "Tiếp" hoặc "Đăng"
            const postButton = await page.waitForSelector('div[aria-label="Đăng"], button[aria-label="Đăng"], button[role="button"]:has-text("Tiếp")', { timeout: 10000 });
            await postButton.click();

            console.log(`✅ Đã đăng bài lên: ${url}`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.log(`🚨 Lỗi khi đăng bài lên ${url}:`, error.message);
        }
    }

    console.log("🎉 Hoàn thành đăng bài lên tất cả các trang!");
    await browser.close();
})();
