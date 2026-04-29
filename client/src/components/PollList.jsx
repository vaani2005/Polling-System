import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, getToken } from "../api";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [voted, setVoted] = useState({});
  const navigate = useNavigate();

  const token = getToken();

  const fetchPolls = async () => {
    try {
      const data = await request("/poll");
      setPolls(data);
    } catch (err) {
      console.log(err);
    }
  };

  const vote = async (pollId, optionIndex) => {
    if (!token) return navigate("/login");

    try {
      const res = await request("/poll/vote", "POST", {
        pollId,
        optionIndex,
      });

      alert(res.msg || "Vote counted");

      setVoted((prev) => ({ ...prev, [pollId]: true }));
      fetchPolls();
    } catch (err) {
      if (err.msg === "Already voted") {
        alert("You already voted on this poll");
        setVoted((prev) => ({ ...prev, [pollId]: true }));
      } else {
        alert(err.msg || "Error voting");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 3000);
    return () => clearInterval(interval);
  }, []);

  // return (
  //   <div>
  //     <h2>Live Polls</h2>

  //     {token && (
  //       <>
  //         <button onClick={() => navigate("/create")}>Create Poll</button>
  //         <button onClick={logout}>Logout</button>
  //       </>
  //     )}

  //     {polls.map((p) => (
  //       <div key={p._id}>
  //         <h3>{p.question}</h3>

  //         {p.options.map((opt, i) => (
  //           <div key={i}>
  //             {opt.text} - {opt.votes}
  //             <button disabled={voted[p._id]} onClick={() => vote(p._id, i)}>
  //               {voted[p._id] ? "Voted" : "Vote"}
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
    <div className="poll-container">
      <h2>Live Polls</h2>

      {token && (
        <div className="top-bar">
          <button className="create-btn" onClick={() => navigate("/create")}>
            Create Poll
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {polls.map((p) => (
        <div className="poll-card" key={p._id}>
          <div className="poll-header">
            <h3>{p.question}</h3>
          </div>

          <div className="poll-options">
            {p.options.map((opt, i) => (
              <div className="option-row" key={i}>
                <div className="option-text">
                  {opt.text}
                  <span className="votes">({opt.votes})</span>
                </div>

                <button
                  className="vote-btn"
                  disabled={voted[p._id]}
                  onClick={() => vote(p._id, i)}
                >
                  {voted[p._id] ? "Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
