const http = require("http");
const { text, buffer } = require("stream/consumers");
const fs = require("fs");
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head>");
    res.write("<title> My First Page </title>");
    res.write("<body>");
    res.write('<form action="/message" method="POST">');
    res.write('<input type="text" name="message">');
    res.write('<button type="submit">send</button>');
    res.write("</form>");
    res.write("</body>");
    res.write("</head>");
    res.write("</html>");
    res.end();
    return;
  }
  if (url === "/message" && method === "POST") {
    let body = [];
    let messageText = "";
    req.on("data", (chunk) => {
      console.log(chunk);
      console.log(" /n ");
      body.push(chunk);
    });
    return req.on("end", () => {
      //console.log(body);
      const finalData = Buffer.concat(body).toString().replaceAll("+", " ");
      messageText = finalData.split("=")[1];
      console.log(messageText);
      fs.writeFileSync("newFile.txt", messageText);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
    });
  }
  /* 
  console.log("i hear you");
  console.log(req.headers.host);
  console.log(req.method);
  console.log(req.url); */
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
