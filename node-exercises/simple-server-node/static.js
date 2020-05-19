const http = require("http");
const fs = require("fs");
const path = require("path");
const rootPath = __dirname;
const SLASH_REGEX = /^\/+|\/+$/g;
const SUCCESS = 200;
const NOT_FOUND = 404;

const toCheckExtensionAndReadStaticFiles = (req, res, folderInfo) => {
  const filePath = path.join(rootPath, folderInfo.replace(SLASH_REGEX, ''), req.url);
  if (req.url === "" || req.url === "/" || req.url.match("index.html$")) {
    fs.readFile("./public/index.html", "utf-8", (err, html) => {
      res.writeHead(SUCCESS, "OK", {
        "Content-Type": "text/html"
      });
      res.end(html);
    });
  } else if (req.url.match(".html$")) {
    let fileStream = fs.createReadStream(filePath, "utf-8");
    res.writeHead(SUCCESS, {
      "Content-Type": "text/html"
    });
    fileStream.pipe(res);
  } else if (req.url.match(".css$")) {
    let fileStream = fs.createReadStream(filePath, "utf-8");
    res.writeHead(SUCCESS, {
      "Content-Type": "text/css"
    });
    fileStream.pipe(res);
  } else if (req.url.match(".js$")) {
    let fileStream = fs.createReadStream(filePath, "utf-8");
    res.writeHead(SUCCESS, {
      "Content-Type": "text/javascript"
    });
    fileStream.pipe(res);
  } else if (req.url.match(".png$")) {
    let fileStream = fs.createReadStream(filePath);
    res.writeHead(SUCCESS, {
      "Content-Type": "image/png"
    });
    fileStream.pipe(res);
  } else if (req.url.match(".json$")) {
    let fileStream = fs.createReadStream(filePath);
    res.writeHead(SUCCESS, {
      "Content-Type": "application/json"
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(NOT_FOUND, {
      "Content-Type": "text/html"
    });
    res.end("No page found");
  }
};
const server = http.createServer((req, res) => {
  toCheckExtensionAndReadStaticFiles(req, res, '/public');
});
server.listen(4000);
