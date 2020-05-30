import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './css/Dashboard.css';

const ENTER_KEY = 13;
const Dashboard = ({ location }) => {
  const history = useHistory();
  const [tasks, setTasks] = useState([]);

  //Function defined to get the username from URL
  useEffect(() => {
    const queryString = new URLSearchParams(location.search);
    // const helper = new Api();
    // const list = helper.getList(queryString.get('uname'));
    // setTasks([ ...list ]);
    console.log(queryString.get('uname'));
  }, [location])

  // //Function defined to get the username from URL
  // useEffect(() => {
  //
  // }, [tasks])

  const handleKeyPress = (e) => {
    if (e.which === ENTER_KEY || e.keyCode === ENTER_KEY) {
      if (!tasks.includes(e.target.value)) {
        setTasks([...tasks, e.target.value]);
      }
    }
  }

  const removeTask = (index) => {
    console.log(index);
    tasks.splice(index, 1);
    setTasks([ ...tasks ]);
  }
  //Dynamic CSS will be added here
  const styles = {

  }
  console.log(tasks);
  const list = tasks.map((task, i) =>
    (<div key={i}>
      <div className="task-list">
        <li key={i} className="task">{task}</li>
      </div>
      <div className="task-actions">
        <button className="remove" onClick={() => removeTask(i)}>Remove</button><button className="edit">Edit</button>
      </div>
    </div>))
  return (
    <>
      <div>
        <h1>TO DO LIST</h1>
        <div className="to-do-list-panel">
          <div className="to-do-add-section">
            <input type="text" name="task" onKeyPress={handleKeyPress}/>
          </div>
          <div className="to-do-list-section">
            <ul>
              {list}
            </ul>
          </div>
          </div>
        <button onClick={()=> history.push(`/`)}>Logout</button>
      </div>
    </>
  );
}

export default Dashboard;
