function isValidEmail(email) {
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_pattern.test(email);
}

function isValidPassword(password) {
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return password_pattern.test(password);
}

function isValidName(name) {
  const name_pattern = /^[A-Za-z\s]+$/;
  return name_pattern.test(name);
}

function move() {
  window.location.href = "../pages/sign_in.html";
}

const form = document.getElementById("signup-form");
const err = document.getElementById("error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("user-type").value;

  // Reset error messages
  err.innerText = "";

  if (!isValidEmail(email)) {
    err.innerText = "Email should be similar to username@example.com";
  } else if (!isValidPassword(password)) {
    err.innerText =
      "Password should have at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long";
  } else if (!isValidName(fullname)) {
    err.innerText = "Full name should contain only alphabetic characters";
  } else if (userType === "") {
    err.innerText = "Choose a user type";
  } else {
    // If all validations pass, proceed with the POST request
    console.log(userType);
    err.innerText = "";

    const userData = {
      name: fullname,
      email: email,
      password: password,
      user_types_id: userType,
    };

    axios
      .post("http://127.0.0.1:8000/api/register", userData)
      .then((response) => {
        console.log(response.data);
        if (response.data.message === "User created successfully") {
            
        // Save the cart ID in local storage
          const cartId = response.data.cart.id;
          window.localStorage.setItem("cart_id", cartId);
          err.setAttribute("class", "success");
          err.innerText = "Created successfully!";
          setTimeout(move, 2000);
        } else {
          err.innerText = "An error occurred. Please try again later.";
        }
      })
      .catch((error) => {
        console.error(error);
        err.innerText = "An error occurred. Please try again later.";
      });
  }
});
