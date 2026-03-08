// SPA AJAX for routines and exercises using jQuery
$(function () {
  // --- Routines ---
  function renderRoutines(routines) {
    const $list = $("#history-list");
    if (!$list.length) return;
    if (!routines.length) {
      $list.html('<p style="color:var(--muted);">No saved plans yet. Generate one to see it here.</p>');
      return;
    }
    $list.html(
      routines
        .map(
          (r) =>
            `<li data-id="${r._id}"><strong>${r.name}</strong> (${r.muscle}, ${r.equipment}) <button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button></li>`
        )
        .join("")
    );
  }
  function loadRoutines() {
    $.get("/api/routines")
      .done(renderRoutines)
      .fail((xhr) => console.error("Failed to load routines", xhr.responseText));
  }
  function createRoutine(data) {
    $.ajax({
      url: "/api/routines",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
    })
      .done(() => {
        console.log("Routine created");
        loadRoutines();
      })
      .fail((xhr) => console.error("Failed to create routine", xhr.responseText));
  }
  function updateRoutine(id, data) {
    $.ajax({
      url: "/api/routines/" + id,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
    })
      .done(() => {
        console.log("Routine updated");
        loadRoutines();
      })
      .fail((xhr) => console.error("Failed to update routine", xhr.responseText));
  }
  function deleteRoutine(id) {
    $.ajax({
      url: "/api/routines/" + id,
      method: "DELETE",
    })
      .done(() => {
        console.log("Routine deleted");
        loadRoutines();
      })
      .fail((xhr) => console.error("Failed to delete routine", xhr.responseText));
  }
  // --- Exercises ---
  function renderExercises(exercises) {
    const $list = $("#exercise-list");
    if (!$list.length) return;
    if (!exercises.length) {
      $list.html('<p style="color:var(--muted);">No exercises found.</p>');
      return;
    }
    $list.html(
      exercises
        .map(
          (e) =>
            `<li data-id="${e._id}"><strong>${e.name}</strong> (${e.muscle}, ${Array.isArray(e.equipment) ? e.equipment.join(", ") : e.equipment}) <button class="edit-ex-btn">Edit</button> <button class="delete-ex-btn">Delete</button></li>`
        )
        .join("")
    );
  }
  function loadExercises() {
    $.get("/api/exercises")
      .done(renderExercises)
      .fail((xhr) => console.error("Failed to load exercises", xhr.responseText));
  }
  function createExercise(data) {
    $.ajax({
      url: "/api/exercises",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
    })
      .done(() => {
        console.log("Exercise created");
        loadExercises();
      })
      .fail((xhr) => console.error("Failed to create exercise", xhr.responseText));
  }
  function updateExercise(id, data) {
    $.ajax({
      url: "/api/exercises/" + id,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
    })
      .done(() => {
        console.log("Exercise updated");
        loadExercises();
      })
      .fail((xhr) => console.error("Failed to update exercise", xhr.responseText));
  }
  function deleteExercise(id) {
    $.ajax({
      url: "/api/exercises/" + id,
      method: "DELETE",
    })
      .done(() => {
        console.log("Exercise deleted");
        loadExercises();
      })
      .fail((xhr) => console.error("Failed to delete exercise", xhr.responseText));
  }
  // --- Event Listeners ---
  $("#planner-form").on("submit", function (e) {
    e.preventDefault();
    const data = $(this)
      .serializeArray()
      .reduce((acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
      }, {});
    createRoutine(data);
  });
  $("#history-list").on("click", ".delete-btn", function () {
    const id = $(this).closest("li").data("id");
    if (id) deleteRoutine(id);
  });
  $("#history-list").on("click", ".edit-btn", function () {
    const id = $(this).closest("li").data("id");
    console.log("Edit routine", id);
    // Add modal or inline editing as needed
  });
  $("#exercise-form").on("submit", function (e) {
    e.preventDefault();
    const data = $(this)
      .serializeArray()
      .reduce((acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
      }, {});
    if (data.equipment) data.equipment = data.equipment.split(",").map((s) => s.trim());
    createExercise(data);
  });
  $("#exercise-list").on("click", ".delete-ex-btn", function () {
    const id = $(this).closest("li").data("id");
    if (id) deleteExercise(id);
  });
  $("#exercise-list").on("click", ".edit-ex-btn", function () {
    const id = $(this).closest("li").data("id");
    console.log("Edit exercise", id);
    // Add modal or inline editing as needed
  });
  // Initial load
  loadRoutines();
  loadExercises();
});
