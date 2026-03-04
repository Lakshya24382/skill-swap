import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      alert("Login successful 🚀");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };

  const sendSwap = async (receiverId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:8000/api/swaps",
      {
        receiver: receiverId,
        offeredSkill: "React",
        requestedSkill: "UI/UX",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Swap request sent 🚀");
  } catch (error) {
    alert("Error sending swap");
  }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>All Users</h1>

        <button onClick={fetchUsers}>Load Users</button>

        <ul>
          {users.map((user) => (
            <li key={user._id} style={{ marginBottom: "20px" }}>
              <strong>{user.name}</strong> <br />
              Skills Offered: {user.skillsOffered.join(", ")} <br />
              Skills Wanted: {user.skillsWanted.join(", ")}

              <br /><br />

              <button onClick={() => sendSwap(user._id)}>
                Send Swap
              </button>
            </li>
          ))}
        </ul>
      </div>
     );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>All Users</h1>

      <button onClick={fetchUsers}>Load Users</button>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> — {user.skillsOffered.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;