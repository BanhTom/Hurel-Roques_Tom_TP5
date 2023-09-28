import http from "node:http";

const host = "localhost";
const port = 8000;

import fs from "node:fs/promises";

async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const urlPartie = request.url.split("/");
    const route = urlPartie[1];
    switch (route) {
      case "index.html":
        const contenu = await fs.readFile("index.html", "utf8");
        response.writeHead(200);
        return response.end(contenu);
        case "random.html":
          const numInt = parseInt(urlPartie[2]); 
          if (!isNaN(numInt)) {
            const randomNum = Array.from({ length: numInt }, () => Math.floor(100 * Math.random()));
            response.writeHead(200);
            response.end(`<html><p>${randomNum.join("<br>")}</p></html>`);
          } else {
            response.writeHead(400);
            response.end(`<html><p>400: Requête incorrecte</p></html>`);
          }
          break;
      default:
        response.writeHead(404);
        return response.end(`<html><p>404: NOT FOUND</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

