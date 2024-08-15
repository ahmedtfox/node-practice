const http = require("http");

const server = http.createServer((req, res) => {
  console.log("i hear you");
  console.log(req.headers.host);
  console.log(req.method);
  console.log(req.url);
  //console.log(req.headers.host);
  //console.log(req.host);
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head>");
  res.write("<title> My First Page </title>");
  res.write("<body>");
  res.write("<h2>");
  res.write("Hello from my Node.js server");
  res.write("</h2>");
  res.write("</body>");
  res.write("</head>");
  res.write("</html>");
  res.end();
  //process.exit();
});

server.listen(3000);
