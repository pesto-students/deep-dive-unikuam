const http = require("http");
const fs = require("fs");
const path = require("path");
const rootPath = __dirname;

const toCheckExtensionAndReadStaticFiles = (req, res) => {
  const filePath = path.join(rootPath, "public", req.url);
  if (req.url === "" || req.url === "/" || req.url.match("index.html$")) {
    fs.readFile("./public/index.html", "utf-8", (err, html) => {
      res.writeHead(200, "OK", { "Content-Type": "text/html" });
      res.end(html);
    });
  } else if (req.url.match(".html$")) {
    let htmlPath = filePath;
    let fileStream = fs.createReadStream(htmlPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    fileStream.pipe(res);
  } else if (req.url.match(".css$")) {
    let cssPath = filePath;
    let fileStream = fs.createReadStream(cssPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/css" });
    fileStream.pipe(res);
  } else if (req.url.match(".js$")) {
    let jsPath = filePath;
    let fileStream = fs.createReadStream(jsPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/javascript" });
    fileStream.pipe(res);
  } else if (req.url.match(".png$")) {
    let imagePath = filePath;
    let fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    fileStream.pipe(res);
  } else if (req.url.match(".json$")) {
    let jsonPath = filePath;
    let fileStream = fs.createReadStream(jsonPath);
    res.writeHead(200, { "Content-Type": "application/json" });
    fileStream.pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("No page found");
  }
};

const server = http.createServer((req, res) => {
  toCheckExtensionAndReadStaticFiles(req, res);
});

server.listen(4000);
