import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Custom Modal Component
const Modal = ({ isOpen, onClose, onConfirm, todoItem }) => {
  if (!isOpen) return null;

  return (
    <div className="akbmodal-overlay">
      <div className="akbmodal">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{todoItem}"?</p>
        <div className="akbmodal-actions">
          <button onClick={onClose} className="button_type cancel">Cancel</button>
          <button onClick={onConfirm} className="button_type delete">Delete</button>
        </div>
      </div>
    </div>
  );
};

function App() {
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [todoToDelete, setTodoToDelete] = useState(null); // Track todo to delete

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

    if (editing) {
      // Update the existing todo
      setTodos(
        todos.map((todo) =>
          todo.id === currentTodo.id ? { ...todo, item: item.trim() } : todo
        )
      );
      setEditing(false); // Exit editing mode
      toast.success("Todo updated successfully!"); // Toast for edit
    } else {
      // Add new todo with a unique ID
      const todo_v = {
        id: Date.now(),
        item: item.trim() // Trim the input
      };
      setTodos([...todos, todo_v]);
      toast.success("Todo added successfully!"); // Toast for add
    }

    setItem(''); // Clear the input field
  };

  const handleDelete = (id) => {
    const deletedTodo = todos.find((todo) => todo.id === id);
    setTodos(todos.filter((todo) => id !== todo.id)); // Delete the todo
    toast.error(`Deleted: ${deletedTodo.item}`); // Toast for delete
    setIsModalOpen(false); // Close the modal
  };

  const handleEdit = (todo) => {
    setEditing(true); // Enter editing mode
    setCurrentTodo(todo); // Set the current todo being edited
    setItem(todo.item); // Populate the input field with the todo's item
  };

  const openDeleteModal = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setTodoToDelete(todo); // Set the todo to delete
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
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
                {todo.item} ({todo.id}) 
                <button onClick={() => handleEdit(todo)} className='button_type edit'>Edit</button>
                <button onClick={() => openDeleteModal(todo.id)} className='button_type delete'>X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Custom Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleDelete(todoToDelete.id)}
        todoItem={todoToDelete ? todoToDelete.item : ''}
      />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;