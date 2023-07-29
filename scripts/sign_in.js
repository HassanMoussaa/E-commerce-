const form = document.querySelector("form");
const err = document.getElementById("error");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("user-type").value;

  const data = new FormData();
  data.append("email", email);
  data.append("password", password);
  data.append("user_types_id", userType);

  axios.post("http://127.0.0.1:8000/api/login", data)
    .then((response) => {
      console.log(response.data);
      if (response.data.message === "Unauthorized") {
        err.innerText = "Incorrect credentials";
      } else {
        err.innerText = "";

        const userTypeId = response.data.user.user_type_id;

        window.localStorage.setItem('id', response.data.user.id);
        window.localStorage.setItem('user_type_id', userTypeId);
          //admin 
        if (userTypeId === 1) {
          window.location.href = "../pages/dashboard_admin.html";
        } else if (userTypeId === 2) {  //user 
          window.location.href = "../pages/index.html";
        } else {
          console.error("Invalid user_type_id:", userTypeId);
        }
      }
    })
    .catch((error) => {
      console.error(error); 
      err.innerText = "An error occurred. Please try again later.";
    });
});
