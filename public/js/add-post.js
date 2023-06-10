const newPostFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the form
  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#content").value.trim();

  if (title && content) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector(".new-post-form")
  .addEventListener("submit", newPostFormHandler);
