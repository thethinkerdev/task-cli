const fs = require("node:fs/promises");
const path = require("node:path");
const EventEmitter = require("node:events");
const os = require("node:os");

const myEmitter = new EventEmitter();

const db_dir = path.join(os.homedir(), "db_tasks");
const db_file = path.join(db_dir, "tasks.json");

console.log(db_dir);

myEmitter.once("first_task_make", () => {
  console.log(
    "Welcome to the App, You'v Just Created your First Task !!! Horra"
  );
});
myEmitter.on("log_add_task", async (title) => {
  const log = `${title} : has been added.\n`;
  console.log(log);
  await fs.appendFile(path.join(db_dir, "logs.txt"), log);
});

myEmitter.on("log_remove_task", async (title) => {
  const log = `${title} : has been removed.\n`;
  console.log(log);
  await fs.appendFile(path.join(db_dir, "logs.txt"), log);
});

// #todo : اگه کاربر آرایه داخل رو پاک کنه برنامه کرش میکنه
const initDB = async () => {
  try {
    // create DB directory :
    await fs.mkdir(db_dir, { recursive: true });
  } catch (error) {
    //exists :
    console.log(error.message);
  }

  try {
    // check if tasks.json exists if not throws an error :
    await fs.access(db_file);
  } catch (error) {
    await fs.writeFile(db_file, "[]");
  } finally {
    console.log("Database file created.");
  }

  try {
    if (path.extname(db_file) !== ".json") {
      throw new Error("Only Json extension is valid !");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const readDB = async () => {
  try {
    const data = await fs.readFile(db_file, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const addTask = async (title) => {
  try {
    const jsonData = await readDB();

    jsonData.push(title);
    const result = JSON.stringify(jsonData);

    await fs.writeFile(db_file, result);

    myEmitter.emit("first_task_make");
    myEmitter.emit("log_add_task", title);
  } catch (error) {
    console.log(error.message);
  }
};

const showTasks = async () => {
  try {
    const jsonData = await readDB();

    jsonData.forEach((item, index) => {
      console.log(`${index + 1}. Task Title : ${item}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteTask = async (title) => {
  try {
    const jsonData = await readDB();

    const newList = jsonData.filter((item) => item !== title);

    await fs.writeFile(db_file, JSON.stringify(newList));

    myEmitter.emit("log_remove_task", title);
  } catch (error) {
    console.log(error.message);
  }
};
const main = async () => {
  await initDB();

  await addTask("go to لالا 1");
  await addTask("go to sleep 2");
  await addTask("go to sleep 3");
  await addTask("go to sleep 4");

  await showTasks();

  await deleteTask("go to sleep 2");

  await showTasks();
};

main();
