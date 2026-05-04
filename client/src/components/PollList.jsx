import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, getToken } from "../api";
import Swal from "sweetalert2";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [voted, setVoted] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = getToken();

  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  const fetchPolls = async () => {
    try {
      const data = await request("/poll");
      if (!data) return;

      setPolls(data);

      const voteState = {};
      data.forEach((p) => {
        if (p.userVote !== null && p.options[p.userVote]) {
          voteState[p._id] = p.userVote;
        }
      });

      setVoted(voteState);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Failed to load polls",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pollId) => {
    if (!token) return navigate("/login");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This poll will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    const res = await request(`/poll/${pollId}`, "DELETE");
    if (!res) return;

    Swal.fire({
      icon: "success",
      text: res.msg || "Poll deleted",
      timer: 1200,
      showConfirmButton: false,
    });

    fetchPolls();
  };

  const vote = async (pollId, optionIndex) => {
    if (!token) return navigate("/login");

    const res = await request("/poll/vote", "POST", {
      pollId,
      optionIndex,
    });

    if (!res) return;

    Swal.fire({
      icon: "success",
      text: "Vote submitted",
      timer: 1000,
      showConfirmButton: false,
    });

    fetchPolls();
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // ⏳ Loading state
  if (loading) {
    return <p className="center-text">Loading polls...</p>;
  }

  return (
    <div className="poll-container">
      <h2>Live Polls</h2>

      {polls.length === 0 && <p className="center-text">No polls available</p>}

      {polls.map((p) => (
        <div className="poll-card" key={p._id}>
          <div className="poll-header">
            <h3>{p.question}</h3>

            {p.createdBy === userId && (
              <div>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${p._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="poll-options">
            {p.options.map((opt, i) => (
              <div className="option-row" key={i}>
                <div className="option-text">
                  {opt.text}
                  <span className="votes">({opt.votes})</span>
                </div>

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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
