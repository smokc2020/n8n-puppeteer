import express from "express";
import puppeteer from "puppeteer";

const app = express();
const port = 4000;

app.use(express.json());

app.post("/post-to-facebook", async (req, res) => {
    const { pages, content, images } = req.body;
    if (!pages || !content) {
        return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
    }

    console.log("📌 Nhận dữ liệu từ n8n:", req.body);

    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: false,
        userDataDir: "C:\\Users\\smokc\\AppData\\Local\\Google\\Chrome\\User Data\\1",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--profile-directory=Default"
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        for (const fbPage of pages) {
            console.log(`🔹 Đang đăng bài lên: ${fbPage}`);

            await page.goto(`https://www.facebook.com/${fbPage}`, { waitUntil: "networkidle2" });

            // Chuyển sang quyền quản trị Page
            await page.waitForSelector('div[aria-label="Chuyển ngay"]', { timeout: 10000 });
            await page.click('div[aria-label="Chuyển ngay"]');

            await new Promise(r => setTimeout(r, 2000)); // Chờ 2 giây
            await page.waitForSelector(`a[href*="${fbPage}"]`);
            await page.click(`a[href*="${fbPage}"]`);

            await new Promise(r => setTimeout(r, 3000)); // Chờ 3 giây

            await page.evaluate(() => window.scrollBy(0, 500)); // Cuộn xuống một chút
            // Nhấn vào nút mở popup đăng bài
            // await page.waitForSelector('div[role="button"] span', { timeout: 10000 });
            // await page.click('div[role="button"] span');
             // ✅ Extract all div[role="textbox"] elements (post input boxes)
            const postBoxes = await page.$$eval('div[role="textbox"]', elements =>
                elements.map(el => el.outerHTML)
            );

          
          

            await new Promise(r => setTimeout(r, 3000)); // Chờ 3 giây

            // Chờ popup mở hoàn toàn
            await page.waitForSelector('div[role="dialog"]', { timeout: 10000 });
            
            // Nhập nội dung vào ô soạn bài viết trong popup
            await page.waitForSelector('div[role="textbox"]', { timeout: 10000 });
            await page.type('div[role="textbox"]', content, { delay: 50 });
  

            // Nếu có hình ảnh, tải lên
            if (images && images.length > 0) {
                const inputUpload = await page.waitForSelector('input[type="file"]', { timeout: 5000 });
                await inputUpload.uploadFile(...images);

                console.log(`🖼 Đã tải lên ${images.length} hình ảnh`);
                await new Promise(r => setTimeout(r, 5000)); // Chờ 5 giây để tải ảnh
            }

            // Nhấn nút Đăng bài
            await page.waitForSelector('div[aria-label="Đăng"]', { timeout: 10000 });
            await page.click('div[aria-label="Đăng"]');

            console.log(`✅ Đã đăng bài lên: ${fbPage}`);
            await new Promise(r => setTimeout(r, 5000)); // Chờ 5 giây trước khi chuyển trang tiếp theo
        }

        await browser.close();
        res.json({ success: true, message: "Đăng bài thành công!" });

    } catch (error) {
        console.error("❌ Lỗi:", error);
        await browser.close();
        res.status(500).json({ success: false, message: "Có lỗi xảy ra!" });
    }
});

app.listen(port, () => {
    console.log(`🚀 API đang chạy tại http://localhost:${port}`);
});
