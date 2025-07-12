document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("employee-form");
  const employeeGrid = document.getElementById("employeeGrid");
  const editingId = document.getElementById("editingId");
  const searchInput = document.getElementById("search");
  const filterDepartment = document.getElementById("filterDepartment");
  const filterRole = document.getElementById("filterRole");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newEmployee = {
      id: editingId.value || Date.now(),
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      department: form.department.value,
      role: form.role.value,
    };
    if (!validateEmployee(newEmployee)) return;
    const existingCard = document.querySelector(`.employee-card[data-id='${newEmployee.id}']`);
    if (existingCard) {
      existingCard.outerHTML = renderCard(newEmployee);
    } else {
      employeeGrid.insertAdjacentHTML("beforeend", renderCard(newEmployee));
    }
    form.reset();
    editingId.value = "";
    document.getElementById("form-title").textContent = "Add Employee";
  });

  employeeGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".employee-card");
    if (e.target.classList.contains("edit-btn")) {
      form.firstName.value = card.querySelector("h3").textContent.split(" ")[0];
      form.lastName.value = card.querySelector("h3").textContent.split(" ")[1];
      form.email.value = card.querySelector("p:nth-of-type(1)").textContent.split(": ")[1];
      form.department.value = card.querySelector("p:nth-of-type(2)").textContent.split(": ")[1];
      form.role.value = card.querySelector("p:nth-of-type(3)").textContent.split(": ")[1];
      editingId.value = card.dataset.id;
      document.getElementById("form-title").textContent = "Edit Employee";
    }
    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this employee?")) {
        card.remove();
      }
    }
  });

  [searchInput, filterDepartment, filterRole].forEach((el) => {
    el.addEventListener("input", () => filterCards());
  });

  function filterCards() {
    const search = searchInput.value.toLowerCase();
    const dept = filterDepartment.value;
    const role = filterRole.value;
    document.querySelectorAll(".employee-card").forEach((card) => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const email = card.querySelector("p:nth-of-type(1)").textContent.toLowerCase();
      const department = card.querySelector("p:nth-of-type(2)").textContent.split(": ")[1];
      const cardRole = card.querySelector("p:nth-of-type(3)").textContent.split(": ")[1];
      const match =
        (name.includes(search) || email.includes(search)) &&
        (!dept || dept === department) &&
        (!role || role === cardRole);
      card.style.display = match ? "block" : "none";
    });
  }

  function validateEmployee(emp) {
    if (!emp.firstName || !emp.lastName || !emp.email || !emp.department || !emp.role) {
      alert("All fields are required.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emp.email)) {
      alert("Invalid email address.");
      return false;
    }
    return true;
  }

  function renderCard(emp) {
    return `
      <div class="employee-card" data-id="${emp.id}">
        <h3>${emp.firstName} ${emp.lastName}</h3>
        <p><strong>Email:</strong> ${emp.email}</p>
        <p><strong>Department:</strong> ${emp.department}</p>
        <p><strong>Role:</strong> ${emp.role}</p>
        <div class="actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  }
});
