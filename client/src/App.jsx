import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSwaps, setShowSwaps] = useState(false); // 👈 ADD HERE

  const login = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/login",
      { email, password }
      );

      localStorage.setItem("token", res.data.token);

      // Decode JWT payload
      const payload = JSON.parse(
      atob(res.data.token.split(".")[1])
    );

    localStorage.setItem("userId", payload.id);

    setIsLoggedIn(true);
    fetchSwaps();   // only to get count
    alert("Login successful 🚀");
  } catch (err) {
    alert("Invalid credentials");
  }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:8000/api/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers(res.data);
  };

  const sendSwap = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
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

      alert(res.data.message);
      fetchSwaps(); // auto refresh swaps
    } catch (error) {
      alert(error.response?.data?.message || "Error sending swap");
    }
  };

  const fetchSwaps = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:8000/api/swaps",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSwaps(res.data);
  };

  const updateSwapStatus = async (swapId, status) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8000/api/swaps/${swapId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchSwaps();
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Skill Swap Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ padding: "40px" }}>
      <h1>All Users</h1>

      <button onClick={fetchUsers}>Load Users</button>

      <ul>
        {users.map((user) => {
          const currentUserId = localStorage.getItem("userId");

          return (
            <li key={user._id} style={{ marginBottom: "20px" }}>
              <strong>{user.name}</strong> <br />
              Skills Offered: {user.skillsOffered.join(", ")} <br />
              Skills Wanted: {user.skillsWanted.join(", ")}
              <br /><br />

              {user._id !== currentUserId && (
                <button onClick={() => sendSwap(user._id)}>
                  Send Swap
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <hr />

      <h2>My Swaps ({swaps.length})</h2>
      <button onClick={() => setShowSwaps(true)}>
        Load Swaps
      </button>

      {showSwaps && (
        <ul>
          {swaps.map((swap) => (
            <li key={swap._id} style={{ marginBottom: "20px" }}>
              From: {swap.sender.name} <br />
              To: {swap.receiver.name} <br />
              Offered: {swap.offeredSkill} <br />
              Requested: {swap.requestedSkill} <br />
              Status: {swap.status}
              <br /><br />

              {swap.status === "pending" &&
                swap.receiver._id === localStorage.getItem("userId") && (
                  <>
                    <button
                      onClick={() =>
                        updateSwapStatus(swap._id, "accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateSwapStatus(swap._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;