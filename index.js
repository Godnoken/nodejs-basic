const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // Redirect urls without file extensions to the file name
  // with extension included
  if (req.url === "/about" || req.url === "/contact-me") {
    req.url += ".html";
  }

  // Join together directory and url requested
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  // Get extension name
  let extname = path.extname(filePath);

  // Set content type based on url extension
  let contentType = "text/html";

  switch (extname) {
    case ".css":
      contentType = "text/css";
      break;
    // Not needed on this page but for example
    case ".png":
      contentType = "image/png";
      break;
  }

  // Read file from filePath and redirect user
  // to error or the webpage depending on the result
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (error, content) => {
            res.writeHead(404, { "Content-Type": contentType });
            res.end(content, "utf8");
          }
        );
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log("server running"));
