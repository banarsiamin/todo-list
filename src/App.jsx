import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Initialize todos with unique IDs
  // Load todos from localStorage or initialize with default todos
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [
      { id: 1, item: "amin" },
      { id: 2, item: "School" },
      { id: 3, item: "job" }
    ];
  });

  const [item, setItem] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false); // Track if we're editing
  const [currentTodo, setCurrentTodo] = useState({ id: null, item: "" }); // Current todo being edited

    // Save todos to localStorage whenever they change
    useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the input is empty
    if (!item.trim()) {
      setError("Please enter a valid item!");
      return;
    }

    // Clear the error message
    setError("");
    if(editing){
        // Update the existing todo
        setTodos(
          todos.map((todo) =>
            todo.id === currentTodo.id ? { ...todo, item: item.trim() } : todo
          )
        );
        setEditing(false); // Exit editing mode
    }else{
      // Add new todo with a unique ID
      const todo_v = {
        id: Date.now(),
        item: item.trim() // Trim the input
      }; 
      setTodos([...todos, todo_v]);
    }
    setItem(''); // Clear the input field
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => id !== todo.id)); // Fixed condition
  };

  const handleEdit = (todo) => {
    setEditing(true); // Enter editing mode
    setCurrentTodo(todo); // Set the current todo being edited
    setItem(todo.item); // Populate the input field with the todo's item
  };


  return (
    <>
      <div className='maintodos'>
        <div className='todosm'>
          <h2>Todo List Form</h2>
          {error && <span style={{ color: 'red' }}>{error}</span>}

          <div>
            <form onSubmit={handleSubmit}>
            <input
                value={item}
                onInput={(e) => setItem(e.target.value)}
                type='text'
                name='addtodo'
                className='inputAll'
                placeholder='Enter item here..'
              />
              <button className='button_type add'>
                {editing ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
        <div className='todosm'>
          <h3>Items</h3>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.item} ({todo.id})| <button onClick={() => handleEdit(todo)} className='button_type edit'>Edit</button> <button onClick={() => handleDelete(todo.id)} className='button_type delete'>X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;