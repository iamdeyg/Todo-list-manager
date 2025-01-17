const fs = require("fs");
const path = require("path");

const tasksDbPath = path.join(__dirname, "../db", "tasks.json");

function getAllTasks(req, res) {
  fs.readFile(tasksDbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }
    res.end(data);
  });
}
function addTask(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const parsedTask = Buffer.concat(body).toString();
    const newTask = JSON.parse(parsedTask);

    //adding new task to the end of the existing tasks array
    fs.readFile(tasksDbPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const oldTasks = JSON.parse(data);
      const allTasks = [...oldTasks, newTask];
      fs.writeFile(tasksDbPath, JSON.stringify(allTasks), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error, Could not save task to Database.",
            })
          );
        }
        res.end(JSON.stringify(newTask));
      });
    });
  });
}
// Updating a task by ID
function updateTask(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const parsedTask = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedTask);
    const taskId = detailsToUpdate.id;
    fs.readFile(tasksDbPath, "utf8", (err, tasks) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      //finding the task in the database
      const tasksObj = JSON.parse(tasks);
      const taskIndex = tasksObj.findIndex((task) => task.id === taskId);
      //   console.log(taskIndex);
      if (taskIndex === -1) {
        res.writeHead(404);
        res.end("Task with the specified ID not found");
        return;
      }
      const updatedTask = { ...tasksObj[taskIndex], ...detailsToUpdate };
      tasksObj[taskIndex] = updatedTask;

      fs.writeFile(tasksDbPath, JSON.stringify(tasksObj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error, Could not save task to Database.",
            })
          );
        }
        res.writeHead(200);
        res.end("UPDATE SUCCESSFUL");
      });
    });
  });
}

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
};
