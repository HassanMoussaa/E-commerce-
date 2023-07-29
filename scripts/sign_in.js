const btn = document.getElementById("btn-signin");
let err = document.getElementById("error");

btn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  data = new FormData();
  data.append("email", email);
  data.append("password", password);

  axios.post(`${this.base_url}sign_in.php`, data)
    .then((response) => {
      console.log(response.data);
      if (response.data.message === "Unauthorized") {
        err.innerText = "Incorrect credentials";
      } else {
        err.innerText = "";

        
        const userTypeId = response.data.user.user_type_id;

      
        window.localStorage.setItem('id', response.data.user.id);
     
        window.localStorage.setItem('user_type_id', userTypeId);

        
        if (userTypeId === 1) {
          // User is an admin, redirect to dashboard_admin page
          window.location.href = "../pages/dashboard_admin.html";
        } else if (userTypeId === 2) {
          // User is a regular user, redirect to index.html
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
