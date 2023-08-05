import { useEffect, useState } from 'react'
import img from '../img/bg-desktop-dark.jpg'
import img1 from '../img/bg-mobile-dark.jpg'
import "./App.css"

function App() {

  const [tasks, setTasks] = useState([])
  const [show, setShow] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [loading, setLoading] = useState(true);


  const handelSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setTasks((prevTasks) => [...prevTasks ,{ task: inputValue, id: tasks.length, completed: false }]);
      setInputValue('');
      setShow(true);
      console.log(tasks)
      console.log(inputValue)

    }
  };

  const handleTask = (taskId) => {
    setTasks(prevTasks =>
       prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };
  

  let alive = tasks.filter((task) =>{
    return (task.completed === false)
  })

  const handleCompletedTasks = () => {
    setFilteredTasks( tasks.filter(task => task.completed));
  };
  

  const handleActiveTasks = () => {
    setFilteredTasks(tasks.filter(task => !task.completed));
  };

  const handleAllTasks = () => {
    setFilteredTasks(null);
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const completedAllTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        return { ...task, completed: true };
      })
    );
  };
  
  
  const handleLightning = () => {
    setShow((prev) => !prev)
    document.body.style.backgroundColor = `${show ?  'hsl(235, 21%, 11%)' : "#ffff"}`;

  };
  



  const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const getTasksFromLocalStorage = () => {
    const tasksFromLocalStorage = localStorage.getItem('tasks');
    if (tasksFromLocalStorage) {
      setTasks( JSON.parse(tasksFromLocalStorage));
    }
    setLoading(false);
  };

  useEffect(() => {
    getTasksFromLocalStorage();
    setShow(true)
  }, []);




  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [imageSource, setImageSource] = useState(img);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    // Add event listener to track window width changes
    window.addEventListener('resize', handleResize);
    return () => {
      // Clean up event listener when component unmounts
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Update image source based on window width
    if (windowWidth >= 1000) {
      setImageSource(img);
    } else {
      setImageSource(img1);
    }
  }, [windowWidth]);

  



  

  useEffect(() => {
    if (!loading) {
      saveTasksToLocalStorage();
    }
  }, [tasks, loading]);







  const handleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };


  return (
    <form className='container' onSubmit={handelSubmit}>

      <img src= {imageSource} alt="" />
      <div className="content">
        <div className="header">
          <p>TODO</p>
          {show ? (
            <svg onClick={handleLightning} xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fillRule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>

          ) :  (
          <svg onClick={handleLightning} xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fillRule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>

          )}
        </div>
        <div className="todo-Input">
          <input type="text" placeholder='Create a new todo...' value={inputValue} onChange={handleChange}  />
          <div className="circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/></svg>
          </div>
        </div> 

        <div className="todo-list">
            {show && (filteredTasks === null ? tasks : filteredTasks).map((task) => (
              <div className="todo" key={task.id} onClick={() => handleTask(task.id)}>
                <p className={`input ${task.completed ? "line" : ""}`} > {task.task}</p>
                <div className={`circle ${task.completed ? "done" : ""}`}>
                  <svg className={`svg ${task.completed ? "show" : ""}`} xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/></svg>
                </div>
              </div>
            ))}

            
            
            <div className="options">
              <p className="status"> {alive.length} items left</p>
              <ul className='show-status'>
                <li className='all' onClick={handleAllTasks}>All</li>
                <li className='active' onClick={handleActiveTasks}>Active</li>
                <li className='completed' onClick={handleCompletedTasks}>Completed</li>
              </ul>
              <ul className='allStatus'>
                <li className='clearAll' onClick={clearAllTasks}>Clear</li>
                <li className='completedAll' onClick={completedAllTasks}>Completed</li>
              </ul>
            </div>

        </div>
      </div>
    </form>
  )
}

export default App



