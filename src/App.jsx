import { useState } from "react";

function App() {
  const [script, setScript] = useState("");
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateComic = async () => {
    const scenes = script.split("\n").filter((line) => line.trim() !== "");
    if (scenes.length === 0) {
      alert("Please write at least one scene!");
      return;
    }

    setLoading(true);
    setPanels([]);

    try {
      const results = [];
      for (let i = 0; i < scenes.length; i++) {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Comic panel of the same character. Scene: ${scenes[i]}`,
          }),
        });

        const data = await response.json();

        if (
          data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data
        ) {
          results.push(
            `data:image/png;base64,${data.candidates[0].content.parts[0].inline_data.data}`
          );
        }
      }
      setPanels(results);
    } catch (err) {
      console.error("Error generating panels:", err);
      alert("Something went wrong while generating comic panels.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">🎨 StoryMorph</h1>

      <textarea
        className="border rounded p-2 w-full max-w-lg"
        rows="4"
        placeholder="Write one scene per line (e.g. Hero saves a cat)"
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />

      <button
        onClick={generateComic}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate Comic"}
      </button>

      {panels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {panels.map((panel, idx) => (
            <img key={idx} src={panel} alt={`Panel ${idx + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;   // 👈 CRUCIAL
