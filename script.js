const API_URL = "https://student-departmnet-backend.onrender.com";

function signup(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!username || !password) {
    msg.innerText = "All fields are required";
    return;
  }

  fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");
      return data;
    })
    .then(data => {
      msg.style.color = "green";
      msg.innerText = data.message || "Signup successful";
    })
    .catch(err => {
      msg.style.color = "red";
      msg.innerText = err.message;
    });
}

function login(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("login_username").value.trim();
  const password = document.getElementById("login_password").value.trim();
  const msg = document.getElementById("login_msg");

  msg.innerText = "";

  if (!username || !password) {
    msg.innerText = "All fields are required";
    return;
  }

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      return data;
    })
    .then(data => {
      localStorage.setItem("token", data.access_token);
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      msg.innerText = err.message;
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function addDepartment() {
  const name = document.getElementById("dept_name").value.trim();
  const token = localStorage.getItem("token");

  if (!name) {
    alert("Department name required");
    return;
  }

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
      loadDepartmentDropdown();
    });
}

function loadDepartments() {
  fetch(`${API_URL}/departments`)
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
  const name = document.getElementById("student_name").value.trim();
  const dept_id = document.getElementById("department_select").value;
  const token = localStorage.getItem("token");

  if (!name || !dept_id) {
    alert("All fields required");
    return;
  }

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
      loadStudents();
    });
}

function loadStudents() {
  fetch(`${API_URL}/students`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("student_list");
      if (!list) return;
      list.innerHTML = "";
      data.forEach(student => {
        const li = document.createElement("li");
        li.innerText = `${student.name} (Dept ID: ${student.dept_id})`;
        list.appendChild(li);
      });
    });
}

function loadDepartmentDropdown() {
  fetch(`${API_URL}/departments`)
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
