const express = require('express');
const router = express.Router();
const { findUser, addUser, updateTasksByUser } = require('../helper/user');
let userEmail;

router.post('/findTasksByUser', async (req, res) => {
  const { username } = req.body;
  const todoListDb = req.app.locals.db;
  const userExist = await findUser({ username, todoListDb });
  if (!userExist) {
    res.json({ error: true, info: 'User does not exist.'});
    return;
  }
  res.status(200).json({ error: false, data: userExist});
});

router.post('/validateAndAddUser', async (req, res) => {
	const { username } = req.body;
	const todoListDb = req.app.locals.db;
  const userExist = await findUser({ username, todoListDb });
  if (userExist) {
    res.json({ error: true, info: 'User already exists.' });
    return;
  }
  const { err, result } = await addUser({ username, todoListDb });
  if (err) {
    res.json({ error: true, info: err });
  } else {
    res.json({ error: false, data: result });
  }
});

router.post('/addTaskByUser', async (req, res) => {
  const todoListDb = req.app.locals.db;
  const { username, task } = req.body;
  const user = await findUser({ username, todoListDb });
  if (!user) {
    res.json({ error: true, info: 'User does not exist.'});
    return;
  }
  let allTasks = user.tasks;
  let taskExist = allTasks.find(tsk => tsk.id === task.id);
  if (taskExist) {
    res.json({ error: true, info: 'Task already exists.' });
    return;
  }
  allTasks.push(task);
  const result = await updateTasksByUser({ username, todoListDb, allTasks });
  res.json({ error: false, data: result });
});

router.post('/deleteTaskByUser', async (req, res) => {
  const { username, taskId } = req.body;
  const todoListDb = req.app.locals.db;
  const user = await findUser({ username, todoListDb });
  if (!user) {
    res.json({ error: true, info: 'User does not exist.' });
    return;
  }
  let allTasks = user.tasks;
  let task = allTasks.find(task => task.id === taskId);
  if (!task) {
    res.json({ error: true, info: 'Task does not exist.' });
    return;
  }
  const index = allTasks.indexOf(task);
  allTasks.splice(index, 1);
  const result = await updateTasksByUser({ username, todoListDb, allTasks });
  res.json({ error: false, data: result });
});

router.post('/updateTaskByUser', async (req, res) => {
  const { username, taskId, task } = req.body;
  const todoListDb = req.app.locals.db;
  const user = await findUser({ username, todoListDb });
  if (!user) {
    res.json({ error: true, info: 'User does not exist.' });
    return;
  }
  let allTasks = user.tasks;
  let taskToBeUdpated = allTasks.find(el => el.id === taskId);
  const index = allTasks.indexOf(taskToBeUdpated);
  let keysToBeUpdated = Object.keys(task);
  let allKeys = Object.keys(allTasks)
  for (const key of keysToBeUpdated) {
    if (key === 'id') continue;
    if (allKeys.includes(key)) {
      taskToBeUdpated[key] = task[key];
    }
  }
  allTasks.splice(index, 1, taskToBeUdpated);
  const result = await updateTasksByUser({ username, todoListDb, allTasks });
  res.json({ error: false, data: result });
});

module.exports = router;

// {
// 	"username": "Ashwin",
// 	"task": {
//     "id": '1'
// 		"name": "Clean room",
// 		"createdDate": 1590824490525,
// 		"isCompleted": true,
// 		"CompletedDate": 1590824490525
// 	}
// }
