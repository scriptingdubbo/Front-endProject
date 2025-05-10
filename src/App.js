import React, { useState } from "react";
import {
  Search,
  Trash2,
  Pencil,
  CheckSquare,
  X,
  Move,
  Plus,
} from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "./styles.css";

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Sample Task 1", category: "Category 1", completed: false },
    { id: 2, text: "Sample Task 2", category: "Category 2", completed: false },
  ]);
  const [categories, setCategories] = useState([
    "Category 1",
    "Category 2",
    "Category 3",
  ]);
  const [categoryColors, setCategoryColors] = useState({
    "Category 1": "#fecaca",
    "Category 2": "#fef08a",
    "Category 3": "#bbf7d0",
  });
  const [activeCategory, setActiveCategory] = useState("All Tasks");
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#e0e0e0");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        category: newCategory,
        completed: false,
      };
      setTasks([task, ...tasks]);
      setNewTask("");
    }
  };

  const handleAddCategory = () => {
    if (newCategoryInput.trim() && !categories.includes(newCategoryInput)) {
      setCategories([...categories, newCategoryInput]);
      setCategoryColors({
        ...categoryColors,
        [newCategoryInput]: newCategoryColor,
      });
      setNewCategory(newCategoryInput);
      setNewCategoryInput("");
      setNewCategoryColor("#e0e0e0");
      setShowAddCategory(false);
    }
  };

  const handleDeleteCategory = (categoryToRemove) => {
    setCategories(categories.filter((c) => c !== categoryToRemove));
    setTasks(tasks.filter((t) => t.category !== categoryToRemove));
    const updatedColors = { ...categoryColors };
    delete updatedColors[categoryToRemove];
    setCategoryColors(updatedColors);
    if (activeCategory === categoryToRemove) setActiveCategory("All Tasks");
    if (newCategory === categoryToRemove) setNewCategory("All Tasks");
  };

  const getCategoryStyle = (category) => {
    const bg = categoryColors[category] || "#f3f4f6";
    return { backgroundColor: bg };
  };

  const moveTask = (fromIndex, toIndex) => {
    const updated = [...tasks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setTasks(updated);
  };

  const TaskCard = ({ task, index }) => {
    const [, ref] = useDrag({ type: "task", item: { index } });
    const [, drop] = useDrop({
      accept: "task",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveTask(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });
    return (
      <div
        ref={(node) => ref(drop(node))}
        className={`task-card ${task.completed ? "task-completed" : ""}`}
        style={getCategoryStyle(task.category)}
      >
        {editTaskId === task.id ? (
          <div className="flex">
            <input
              className="flex-1"
              value={editTaskText}
              onChange={(e) => setEditTaskText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSaveEdit}>
              Save
            </button>
          </div>
        ) : (
          <>
            <div className="text-base flex items-center gap-2">
              <Move size={14} /> {task.text}
            </div>
            <div className="task-controls">
              <CheckSquare
                size={18}
                onClick={() => handleToggleComplete(task.id)}
              />
              <Pencil
                size={18}
                onClick={() => handleEditTask(task.id, task.text)}
              />
              <Trash2 size={18} onClick={() => handleDeleteTask(task.id)} />
            </div>
          </>
        )}
      </div>
    );
  };

  const handleEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const handleSaveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editTaskId ? { ...task, text: editTaskText } : task
      )
    );
    setEditTaskId(null);
    setEditTaskText("");
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (activeCategory === "All Tasks" || task.category === activeCategory) &&
      task.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-6">
          Check It!{" "}
          <span role="img" aria-label="smile">
            😊
          </span>
        </h1>

        <div className="top-bar">
          <input
            placeholder="Think of a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleAddTask}>
            Submit
          </button>
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex">
          <div className="category-panel">
            <h2>Categories</h2>
            <button
              className={`category-button ${
                activeCategory === "All Tasks" ? "active" : ""
              }`}
              onClick={() => setActiveCategory("All Tasks")}
              style={{
                backgroundColor:
                  activeCategory === "All Tasks" ? "#ffffff" : "#f3f4f6",
              }}
            >
              All Tasks
            </button>
            {categories.map((cat) => (
              <div key={cat}>
                <button
                  className={`category-button ${
                    activeCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ backgroundColor: categoryColors[cat] || "#f3f4f6" }}
                >
                  {cat}{" "}
                  <span
                    className="remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat);
                    }}
                  >
                    ×
                  </span>
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="btn mt-2"
            >
              + New Category
            </button>
            {showAddCategory && (
              <div className="mt-2">
                <input
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Category name"
                />
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleAddCategory}>
                  Add
                </button>
              </div>
            )}
            <p className="text-xs mt-3">
              Creating a new category adds a tab here.
            </p>
          </div>

          <div className="w-3/4">
            <p>
              Task tiles will be brought to the top if they contain keywords.
            </p>
            <div className="task-box">
              <div className="grid">
                {filteredTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
