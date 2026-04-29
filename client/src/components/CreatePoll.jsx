import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, getToken } from "../api";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    if (!getToken()) navigate("/login");
  }, []);

  const submit = async () => {
    const clean = options.filter((o) => o.trim());

    if (!question || clean.length < 2)
      return alert("Question + 2 options required");
    await request("/poll", "POST", {
      question,
      options: clean,
    });

    navigate("/polls");
  };

  return (
    <div className="create-container">
      <h2>Create Poll</h2>

      <input
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
      <button onClick={() => setOptions([...options, ""])}>Add Option</button>
      <button onClick={submit}>Create</button>
    </div>
  );
}
