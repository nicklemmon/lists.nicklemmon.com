const themeSelect = document.querySelector("#theme");
const savedTheme = document.documentElement.dataset.theme;
themeSelect.value = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system";

themeSelect.addEventListener("change", () => {
  const theme = themeSelect.value;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("wishlist-theme", theme);
  } catch {
    // The theme still works when storage is unavailable.
  }
});
