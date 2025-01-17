const http = require("http");
const fs = require("fs");
const path = require("path");

// const { taskRouter } = require("./router");
const tasksDbPath = path.join(__dirname, "db", "tasks.json");

const {
  getAllTasks,
  addTask,
  updateTask,
} = require("./controller/task_controller");

const PORT = 4000;
const HOST_NAME = "localhost";

function requestHandler(req, res) {
  if (req.url === "/tasks" && req.method === "GET") {
    //READ
    //LOAD AND RETURN SAVED TASKS
    getAllTasks(req, res);
  } else if (req.url === "/tasks" && req.method === "POST") {
    //CREATE
    addTask(req, res);
  } else if (req.url === "/tasks" && req.method === "PUT") {
    //UPDATE
    updateTask(req, res);
  } else if (req.url === "/tasks" && req.method === "DELETE") {
    //DELETE
    console.log("DELETE REQUEST TO TASK ROUTE");
  }
}
// creation of the server
const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server is listening on ${HOST_NAME}:${PORT}`);
});
