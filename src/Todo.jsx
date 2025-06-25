import { useState, useContext, useEffect } from "react";
import ConfirmModal from "./components/ConfirmModal";
import { GlobalContext } from "./context/GlobalContext";

function Todo() {
  const { tasks, setTasks } = useContext(GlobalContext);

  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTag, setTaskTag] = useState("");

  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTag, setEditTag] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const tagColors = {
    personal: "bg-pink-100",
    study: "bg-indigo-100",
    social: "bg-rose-100",
    other: "bg-fuchsia-100",
  };

  const tagIcons = {
    personal: "🏡",
    study: "📚",
    social: "🎉",
    other: "✨",
  };

  const addTask = () => {
    if (taskText.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      date: taskDate,
      tag: taskTag || "",
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskText("");
    setTaskDate("");
    setTaskTag("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.text);
    setEditDate(task.date);
    setEditTag(task.tag);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editTaskId
        ? { ...task, text: editText.trim(), date: editDate, tag: editTag }
        : task
    ));
    setEditTaskId(null);
    setEditText("");
    setEditDate("");
    setEditTag("");
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditText("");
    setEditDate("");
    setEditTag("");
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = () => {
    setTasks(tasks.filter(task => task.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-pink-200">
      <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">✨ To-Do List</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="What do you need to do?"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 min-w-[200px]"
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <select
          value={taskTag}
          onChange={(e) => setTaskTag(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Choose tag</option>
          <option value="personal">Personal</option>
          <option value="study">Study</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={addTask}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-4">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg ${
              task.completed ? "bg-green-100" : tagColors[task.tag] || "bg-pink-100"
            }`}
          >
            {editTaskId === task.id ? (
              <div className="w-full flex flex-col gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <div className="flex flex-wrap gap-2">
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Choose tag</option>
                    <option value="personal">Personal</option>
                    <option value="study">Study</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                  <button onClick={saveEdit} className="text-green-600 hover:underline text-sm">Save</button>
                  <button onClick={cancelEdit} className="text-gray-500 hover:underline text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 flex-grow">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-pink-600"
                  />
                  <span className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {tagIcons[task.tag]} {task.text}
                  </span>
                </div>
                {task.date && (
                  <span className="text-sm text-gray-500">Due: {task.date}</span>
                )}
                {task.tag && (
                  <span className="text-xs text-gray-400">Tag: {task.tag}</span>
                )}
              </div>
            )}

            {editTaskId !== task.id && (
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <button
                  onClick={() => startEdit(task)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(task.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

export default Todo;
