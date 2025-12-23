const API_URL = "https://student-departmnet-backend.onrender.com";

function signup(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      msg.innerText = data.message || data.detail || "Signup done";
    })
    .catch(() => {
      msg.innerText = "Signup failed";
    });
}

function login(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("login_username").value;
  const password = document.getElementById("login_password").value;
  const msg = document.getElementById("login_msg");

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";
      } else {
        msg.innerText = data.detail || "Login failed";
      }
    })
    .catch(() => {
      msg.innerText = "Login failed";
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function addDepartment() {
  const name = document.getElementById("dept_name").value;
  const token = localStorage.getItem("token");

  fetch(`${API_URL}/departments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("dept_name").value = "";
      loadDepartments();
    });
}

function loadDepartments() {
  fetch(`${API_URL}/departments`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("dept_list");
      if (!list) return;

      list.innerHTML = "";
      data.forEach(d => {
        const li = document.createElement("li");
        li.innerText = `${d.id} - ${d.name}`;
        list.appendChild(li);
      });
    });
}

function addStudent() {
  const name = document.getElementById("student_name").value;
  const dept_id = document.getElementById("dept_id").value;
  const token = localStorage.getItem("token");

  fetch(`${API_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, dept_id })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("student_name").value = "";
      document.getElementById("dept_id").value = "";
      loadStudents();
    });
}

function loadStudents() {
  fetch(`${API_URL}/Student`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("student_list");
      if (!list) return;

      list.innerHTML = "";
      data.forEach(s => {
        const li = document.createElement("li");
        li.innerText = `${s.name} (Dept ID: ${s.dept_id})`;
        list.appendChild(li);
      });
    });
}

loadDepartments();
loadStudents();
