const BASE_URL = "https://student-departmnet-backend.onrender.com";

function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("msg").innerText =
        data.message || data.detail || "Signup completed";
    })
    .catch(() => {
      document.getElementById("msg").innerText = "Server error";
    });
}

function login() {
  const username = document.getElementById("login_username").value;
  const password = document.getElementById("login_password").value;

  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        document.getElementById("login_msg").innerText = "Login successful";
      } else {
        document.getElementById("login_msg").innerText =
          data.detail || "Login failed";
      }
    })
    .catch(() => {
      document.getElementById("login_msg").innerText = "Server error";
    });
}

function addDepartment() {
  const name = document.getElementById("dept_name").value;
  const token = localStorage.getItem("token");

  fetch(`${BASE_URL}/departments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(() => loadDepartments());
}

function loadDepartments() {
  fetch(`${BASE_URL}/departments`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("dept_list");
      if (!list) return;

      list.innerHTML = "";
      data.forEach(dept => {
        const li = document.createElement("li");
        li.innerText = dept.name;
        list.appendChild(li);
      });
    });
}

function addStudent() {
  const name = document.getElementById("student_name").value;
  const department_id = document.getElementById("department_select").value;
  const token = localStorage.getItem("token");

  fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, department_id })
  })
    .then(res => res.json())
    .then(() => loadStudents());
}

function loadStudents() {
  fetch(`${BASE_URL}/students`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("student_list");
      if (!list) return;

      list.innerHTML = "";
      data.forEach(student => {
        const li = document.createElement("li");
        li.innerText =
          `${student.name} (Dept ID: ${student.department_id})`;
        list.appendChild(li);
      });
    });
}

function loadDepartmentDropdown() {
  fetch(`${BASE_URL}/departments`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("department_select");
      if (!select) return;

      select.innerHTML = `<option value="">Select Department</option>`;
      data.forEach(dept => {
        const option = document.createElement("option");
        option.value = dept.id;
        option.innerText = dept.name;
        select.appendChild(option);
      });
    });
}

loadDepartments();
loadStudents();
loadDepartmentDropdown();
