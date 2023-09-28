import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import logger from "loglevel";



const host = "localhost";
const port = 8000;

const app = express();

if (app.get("env") === "development") {app.use(morgan("dev"));}

logger.setLevel(logger.levels.DEBUG);

app.set("view engine", "ejs");
app.use(express.static("static"));

app.get(["/", "/index.html"], async function (request, response, next) {
  response.sendFile("index.html", { root: "./" });
});

app.get("/random/:nb", async function (request, response, next) {
  const length = Number.parseInt(request.params.nb, 10);
  if (Number.isNaN(length)) {
    next(createError(400, "Invalid parameter: :nb must be a number."));
    return;
  }
  const numbers = Array.from({ length }, () => Math.floor(100 * Math.random()));
  const welcome = "Welcome to the Random Numbers Page!";
  response.render("random", { numbers, welcome });
});

app.use((request, response, next) => {
  concole.debug(`default route handler : ${request.url}`);
  return next(createError(404));
});

app.use((error, _request, response, _next) => {
  concole.debug(`default error handler: ${error}`);
  const status = error.status ?? 500;
  const stack = app.get("env") === "development" ? error.stack : "";
  const result = { code: status, message: error.message, stack };
  return response.render("error", result);
});

const server = app.listen(port, host);

server.on("listening", () =>
  console.info(
    `HTTP listening on http://${server.address().address}:${server.address().port} with mode '${process.env.NODE_ENV}'`,
  ),
);

console.info(`File ${import.meta.url} executed.`);