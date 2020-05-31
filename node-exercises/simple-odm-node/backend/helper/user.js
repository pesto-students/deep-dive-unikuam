const findUser = async ({ username, todoListDb }) => {
  return await todoListDb.collection('todo-list').findOne({ userName: username });
}

const addUser = async ({ username, todoListDb }) => {
  const userObject = {
    userName: username,
    email: 'test@test.com',
    tasks: []
  }
  return await todoListDb.collection('todo-list').insertOne(userObject);
}

const updateTasksByUser = async ({ username, todoListDb, allTasks }) => {
  return await todoListDb.collection('todo-list').findOneAndUpdate({ userName: username }, { $set: { tasks: allTasks } }, { updatedExisting: true });
}

module.exports = {
  findUser,
  addUser,
  updateTasksByUser
}
