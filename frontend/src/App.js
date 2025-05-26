import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ToDo from "./ToDo.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connect = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const todoContract = new ethers.Contract(contractAddress, ToDo.abi, signer);
        setContract(todoContract);

        const allTasks = await todoContract.getTasks();
        setTasks(allTasks);
      } catch (err) {
        setError(err.message);
      }
    };
    connect();
  }, []);

  const createTask = async () => {
    if (!task.trim()) return alert("Please enter a task");
    try {
      setLoading(true);
      const tx = await contract.createTask(task);
      await tx.wait();

      const updated = await contract.getTasks();
      setTasks(updated);
      setTask("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      setLoading(true);
      const tx = await contract.toggleTask(id);
      await tx.wait();

      const updated = await contract.getTasks();
      setTasks(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      const tx = await contract.deleteTask(id);
      await tx.wait();

      const updated = await contract.getTasks();
      setTasks(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>Decentralized ToDo App</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <input
        type="text"
        placeholder="Enter a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={loading}
        style={{ padding: 8, width: "70%", marginRight: 10 }}
      />
      <button onClick={createTask} disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id.toString()}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
              backgroundColor: t.completed ? "#e0ffe0" : "#fff",
              padding: "10px",
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTask(t.id)}
              disabled={loading}
              style={{ marginRight: 10, transform: "scale(1.2)" }}
            />
            <span
              style={{
                flexGrow: 1,
                textDecoration: t.completed ? "line-through" : "none",
                fontSize: 16,
              }}
            >
              {t.content}
            </span>
            <button
              onClick={() => deleteTask(t.id)}
              disabled={loading}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: 4,
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
