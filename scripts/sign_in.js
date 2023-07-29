const btn = document.getElementById("btn-signin");
let err = document.getElementById("error");

btn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  data = new FormData();
  data.append("email", email); // Change "input" to "email" to match the server-side validation
  data.append("password", password);

  axios.post(`${this.base_url}sign_in.php`, data)
    .then((response) => {
      console.log(response.data);
      if (response.data.message === "Unauthorized" ) {
        err.innerText = "Incorrect credentials";
      } else {
        err.innerText = "";
        window.localStorage.setItem('id', response.data.user.id);
        window.localStorage.setItem('user_type_id', response.data.user.user_type_id); 
        window.location.href = "../pages/index.html";
          const token = response.data.authorization.token;
       
        window.localStorage.setItem('token', token);
      }
    })
    .catch((error) => {
      console.error(error); 
      err.innerText = "An error occurred. Please try again later.";
    });
});
