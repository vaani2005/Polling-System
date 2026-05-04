import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, getToken } from "../api";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [editPoll, setEditPolls] = useState([]);
  const [deletePoll, setDelete] = useState();
  const [voted, setVoted] = useState({});
  const navigate = useNavigate();

  const token = getToken();
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  const fetchPolls = async () => {
    try {
      const data = await request("/poll");

      setPolls(data);
      const voteState = {};
      data.forEach((p) => {
        if (p.userVote !== null && p.options[p.userVote]) {
          voteState[p._id] = p.userVote;
        }
      });

      setVoted(voteState);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (pollId) => {
    if (!token) return (window.location.href = "/login");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this poll?",
    );
    if (!confirmDelete) return;

    try {
      const res = await request(`/poll/${pollId}`, "DELETE");
      alert(res.msg || "Poll deleted");

      fetchPolls();
    } catch (err) {
      alert(err.msg || "Error deleting poll");
    }
  };
  const vote = async (pollId, optionIndex) => {
    if (!token) return (window.location.href = "/login");
    try {
      await request("/poll/vote", "POST", {
        pollId,
        optionIndex,
      });

      // setVoted((prev) => ({
      //   ...prev,
      //   [pollId]: optionIndex,
      // }));

      fetchPolls();
    } catch (err) {
      alert(err.msg || "Error voting");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchPolls();
  }, []);
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
            <div>
              {" "}
              <h3>{p.question}</h3>
            </div>
            <div>
              {"  "}
              {p.createdBy === userId && (
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${p._id}`)}
                >
                  Edit
                </button>
              )}

              {"  "}
              {p.createdBy === userId && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="poll-options">
            {p.options.map((opt, i) => (
              <div className="option-row" key={i}>
                <div className="option-text">
                  {opt.text}
                  <span className="votes">({opt.votes})</span>
                </div>
                <div>
                  {!token ? (
                    <button
                      className="vote-btn"
                      onClick={() => navigate("/login")}
                    >
                      Login to Vote
                    </button>
                  ) : (
                    <button className="vote-btn" onClick={() => vote(p._id, i)}>
                      {voted[p._id] === i ? "Selected" : "Vote"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
