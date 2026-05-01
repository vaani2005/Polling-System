import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { request, getToken } from "../api";

export default function CreatePoll() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    if (!getToken()) navigate("/login");

    if (id) fetchPoll();
  }, [id, navigate]);

  const fetchPoll = async () => {
    try {
      const data = await request(`/poll/${id}`);

      setQuestion(data.question);
      setOptions(data.options.map((opt) => opt.text));
    } catch (err) {
      console.log(err);
    }
  };

  const submit = async () => {
    const clean = options.map((o) => o.trim()).filter((o) => o);
    if (!question || clean.length < 2) {
      return alert("Question + at least 2 options required");
    }
    const uniqueOptions = new Set(clean);
    if (uniqueOptions.size !== clean.length) {
      return alert("Options must be unique (no duplicates allowed)");
    }

    try {
      if (id) {
        await request(`/poll/${id}`, "PUT", {
          question,
          options: clean,
        });
      } else {
        await request("/poll", "POST", {
          question,
          options: clean,
        });
      }
      navigate("/polls");
      window.location.reload();
    } catch (err) {
      console.log(err.msg || "Error saving poll");
      navigate("/login");
    }
  };

  return (
    <div className="create-container">
      <div className="create-box">
        <h2>{id ? "Edit Poll" : "Create Poll"}</h2>
        <input
          value={question}
          placeholder="Enter poll question"
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((o, i) => (
          <input
            key={i}
            value={o}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
          />
        ))}

        <button
          onClick={() => {
            if (options[options.length - 1].trim() === "")
              return alert("Fill current option first");
            setOptions([...options, ""]);
          }}
        >
          Add Option
        </button>
        <button onClick={submit}>{id ? "Update Poll" : "Create"}</button>
      </div>
    </div>
  );
}
