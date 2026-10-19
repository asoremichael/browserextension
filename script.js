
const extensionsGrid = document.querySelector("#extensions-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.querySelector("#theme-toggle");

let extensions = [];
let currentFilter = "all";

// Load extension data from data.json
async function loadExtensions() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error("Could not load extension data.");
    }

    extensions = await response.json();
    renderExtensions();
  } catch (error) {
    extensionsGrid.textContent =
      "Unable to load extensions. Check your data.json file and run the project using Live Server.";
    console.error(error);
  }
}

// Display the extensions that match the current filter
function renderExtensions() {
  extensionsGrid.innerHTML = "";

  const filteredExtensions = extensions.filter((extension) => {
    if (currentFilter === "active") {
      return extension.isActive;
    }

    if (currentFilter === "inactive") {
      return !extension.isActive;
    }

    return true;
  });

  filteredExtensions.forEach((extension) => {
    const card = document.createElement("article");
    card.className = "extension-card";

    const info = document.createElement("div");
    info.className = "extension-info";

    const icon = document.createElement("img");
    icon.className = "extension-icon";
    icon.src = extension.logo;
    icon.alt = "";
    icon.width = 48;
    icon.height = 48;

    const details = document.createElement("div");
    details.className = "extension-details";

    const name = document.createElement("h2");
    name.textContent = extension.name;

    const description = document.createElement("p");
    description.textContent = extension.description;

    details.append(name, description);
    info.append(icon, details);

    const actions = document.createElement("div");
    actions.className = "extension-actions";

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
      "aria-label",
      `Remove ${extension.name}`
    );

    removeButton.addEventListener("click", () => {
      extensions = extensions.filter(
        (item) => item.name !== extension.name
      );

      renderExtensions();
    });

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "toggle";

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = extension.isActive;
    toggleInput.setAttribute(
      "aria-label",
      `Activate ${extension.name}`
    );

    const toggleSlider = document.createElement("span");
    toggleSlider.className = "toggle-slider";

    toggleInput.addEventListener("change", () => {
      extension.isActive = toggleInput.checked;
      renderExtensions();
    });

    toggleLabel.append(toggleInput, toggleSlider);
    actions.append(removeButton, toggleLabel);
    card.append(info, actions);

    extensionsGrid.append(card);
  });

  if (filteredExtensions.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No extensions found.";
    extensionsGrid.append(message);
  }
}

// All, Active, and Inactive filters
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isSelected =
        filterButton === button;

      filterButton.classList.toggle("active", isSelected);
      filterButton.setAttribute(
        "aria-pressed",
        String(isSelected)
      );
    });

    renderExtensions();
  });
});

// Light and dark theme
themeToggle.addEventListener("click", () => {
  const isLightTheme =
    document.body.classList.toggle("light-theme");

  themeToggle.textContent = isLightTheme ? "☾" : "☀";

  themeToggle.setAttribute(
    "aria-label",
    isLightTheme
      ? "Switch to dark theme"
      : "Switch to light theme"
  );
});

// Start the application
loadExtensions();
