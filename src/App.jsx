const response = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: `Comic panel of the same character. Scene: ${scenes[i]}`,
  }),
});
