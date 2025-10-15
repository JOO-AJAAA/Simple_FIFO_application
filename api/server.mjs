import { readFile } from "fs/promises";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "../Public");

async function renderPage(pageName, title = "FCFS/FIFO Simulator") {
  const layout = await readFile(path.join(publicPath, "layout.html"), "utf-8");
  const content = await readFile(path.join(publicPath, "pages", pageName), "utf-8");
  return layout.replace("{{title}}", title).replace("{{content}}", content);
}

export default async function handler(req, res) {
  try {
    let page = "", title = "";

    if (req.url === "/" || req.url === "/index") {
      page = "restaurant.html";
      title = "Rumah makan senang sederhana";
    } else if (req.url === "/penyelesaian_soal") {
      page = "index.html";
      title = "Penyelesaian Soal FCFS/FIFO";
    } else if (req.url === "/about") {
      page = "about.html";
      title = "Tentang";
    } else if (req.url === '/api/menu') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const menu = await readFile(path.join(publicPath, 'data/json/menu_makanan.json'), 'utf-8');
      res.end(menu);
      return;
    } else if (req.url === '/favicon.ico' || req.url === '/iconWeb.svg') {
      const iconPath = path.join(publicPath, req.url);
      const ext = path.extname(iconPath);
      const mime = ext === '.svg' ? 'image/svg+xml' : 'image/x-icon';
      const icon = await readFile(iconPath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(icon);
      return;
    } else {
      const filePath = path.join(publicPath, req.url);
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
      return;
    }

    const html = await renderPage(page, title);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);

  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/html" });
    const errorPage = await readFile(path.join(publicPath, "404.html"), "utf-8");
    res.end(errorPage);
  }
}
