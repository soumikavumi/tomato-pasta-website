/* =========================================================
   script.js
   Shared JavaScript for ALL pages.
   - Highlights the active nav link
   - Handles show/hide buttons (ingredients + steps)
   - Handles comments page (localStorage)
   - Sets the footer year
   IMPORTANT: Always check if elements exist before using them.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Helper: safely get the current page name ---------- */
  function getCurrentPageName() {
    // Example: "index.html" or "ingredients.html"
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);

    // If the site is served and the path ends with "/", treat as index.html
    if (file === "") {
      return "index";
    }

    // Remove ".html"
    return file.replace(".html", "");
  }

  /* ---------- 1) Highlight active nav link ---------- */
  function setActiveNavLink() {
    var currentPage = getCurrentPageName();
    var navLinks = document.querySelectorAll(".nav a");

    if (!navLinks || navLinks.length === 0) return;

    navLinks.forEach(function (link) {
      var page = link.getAttribute("data-page");
      if (page === currentPage) {
        link.classList.add("active");
      }
    });
  }

  /* ---------- 2) Generic show/hide toggle ---------- */
  function setupToggleButton(buttonId, contentId, labelWhenShown, labelWhenHidden) {
    var button = document.getElementById(buttonId);
    var content = document.getElementById(contentId);

    // Safety checks: only run if both elements exist on this page
    if (!button || !content) return;

    // Set initial button label based on current visibility
    if (content.classList.contains("hidden")) {
      button.textContent = labelWhenHidden;
    } else {
      button.textContent = labelWhenShown;
    }

    button.addEventListener("click", function () {
      content.classList.toggle("hidden");

      // Update button label
      if (content.classList.contains("hidden")) {
        button.textContent = labelWhenHidden;
      } else {
        button.textContent = labelWhenShown;
      }
    });
  }

  /* ---------- 3) Comments page with localStorage ---------- */
  function setupComments() {
    var input = document.getElementById("commentInput");
    var addButton = document.getElementById("addCommentBtn");
    var list = document.getElementById("commentsList");

    // Only run if we're on the comments page (elements exist)
    if (!input || !addButton || !list) return;

    var storageKey = "tomatoPastaComments";

    function loadComments() {
      var raw = localStorage.getItem(storageKey);
      if (!raw) return [];

      try {
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        // If stored data is corrupted, start fresh
        return [];
      }
    }

    function saveComments(comments) {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    }

    function renderComments(comments) {
      // Clear current list
      list.innerHTML = "";

      if (comments.length === 0) {
        var emptyItem = document.createElement("li");
        emptyItem.className = "comment-item";
        emptyItem.textContent = "No comments yet. Be the first to add one.";
        list.appendChild(emptyItem);
        return;
      }

      comments.forEach(function (text) {
        var item = document.createElement("li");
        item.className = "comment-item";
        item.textContent = text;
        list.appendChild(item);
      });
    }

    // Initial render
    var comments = loadComments();
    renderComments(comments);

    addButton.addEventListener("click", function () {
      var value = input.value.trim();

      // Basic validation to avoid empty comments
      if (value.length === 0) return;

      comments.push(value);
      saveComments(comments);
      renderComments(comments);

      // Clear input after saving
      input.value = "";
      input.focus();
    });
  }

  /* ---------- 4) Footer year ---------- */
  function setFooterYear() {
    var yearEl = document.getElementById("year");
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Run everything safely ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    setActiveNavLink();
    setFooterYear();

    // Ingredients page toggle
    setupToggleButton(
      "toggleIngredientsBtn",
      "ingredientsSection",
      "Hide ingredients",
      "Show ingredients"
    );

    // Steps page toggle
    setupToggleButton(
      "toggleStepsBtn",
      "stepsSection",
      "Hide steps",
      "Show steps"
    );

    // Comments page logic
    setupComments();
  });
})();
