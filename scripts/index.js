// Function to create a product card
function createProductCard(product) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("product-card");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("product-image");
  const image = document.createElement("img");
  image.src = product.image_url; 
  image.alt = product.name; 
  imageContainer.appendChild(image);

  const productName = document.createElement("p");
  productName.textContent = product.name;
  productName.classList.add("product-name");

  const productDescription = document.createElement("p");
  productDescription.textContent = product.description;
  productDescription.classList.add("product-description");

   //  Add to Cart button
  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Add to Cart";
  addToCartButton.classList.add("add-to-cart-button");
  addToCartButton.id = `add-to-cart-${product.id}`;
  addToCartButton.addEventListener("click", () => {
    addToCart(product); 
  });

  //  heart icon for favorites 
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fas", "fa-heart", "heart-icon");
  heartIcon.id = `heart-icon-${product.id}`;

//   if (isProductFavorited(product.id)) {
//     heartIcon.classList.add("favorited");
//   }

  heartIcon.addEventListener("click", () => {
    toggleFavoriteStatus(product.id); 
  });


  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(productName);
  cardContainer.appendChild(productDescription);
  cardContainer.appendChild(addToCartButton);
  cardContainer.appendChild(heartIcon); 

  return cardContainer;
}

// Function to populate the product container
function populateProductContainer(containerId, products) {
  const container = document.getElementById(containerId);

  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Function to fetch products data from the API
function fetchProducts() {
  axios
    .get("http://127.0.0.1:8000/api/products",{headers:{
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`
    }})
    .then((response) => {
      const responseData = response.data;
      const clothingProducts = [];
      const shoesProducts = [];
      const accessoriesProducts = [];

      
      responseData.forEach((product) => {
        if (product.category_id === 1) {
          clothingProducts.push(product);
        } else if (product.category_id === 2) {
          shoesProducts.push(product);
        } else if (product.category_id === 3) {
          accessoriesProducts.push(product);
        }
      });

     
      populateProductContainer("containerClothing", clothingProducts);
      populateProductContainer("containerShoes", shoesProducts);
      populateProductContainer("containerAccessories", accessoriesProducts);
    })
    .catch((error) => {
      console.error(error);
      
    });
}



// Function to handle adding items to the cart
function addToCart(product) {
  const cartId = window.localStorage.getItem("cart_id");

  // Disable the "Add to Cart" button
  const addToCartButton = document.getElementById(`add-to-cart-${product.id}`);
  addToCartButton.disabled = true;
  addToCartButton.textContent = "Added to Cart";

  // Send a request to the backend to add the product to the cart
  axios
    .post("http://127.0.0.1:8000/api/add_to_cart", {
      cart_id: cartId,
      product_id: product.id,
    }, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`,
      },
    })
    .then((response) => {
      console.log("Product added to cart:", product.name);
      
      showCartMessage(response.data.message);
      
    })
    .catch((error) => {
      console.error("Error adding product to cart:", error);
     
      showCartMessage("An error occurred. Please try again later.");
      
      addToCartButton.disabled = false;
      addToCartButton.textContent = "Add to Cart";
    });
}


    // Function to show the cart message on the screen
    function showCartMessage(message) {
    const cartMessageDiv = document.getElementById("cart-message");
    cartMessageDiv.textContent = message;

    cartMessageDiv.classList.add("show");

    setTimeout(() => {
    cartMessageDiv.textContent = "";
    
    cartMessageDiv.classList.remove("show");
    }, 3000); 
    }



    // Get the cart icon element
    const cartIcon = document.querySelector(".addedToCart");

    
    cartIcon.addEventListener("click", () => {
    window.location.href = "cart.html";
    });



// API call to toggle favorite status
function toggleFavoriteStatus(productId) {
  const token = window.localStorage.getItem("jwt_token");
  if (!token) {
    
    console.error("User is not authenticated. Please log in.");
    return;
  }

  axios
    .post(
      "http://127.0.0.1:8000/api/favorites/add",
      { product_id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data.message);
      
      const heartIcon = document.querySelector(`#heart-icon-${productId}`);
      if (response.data.message === "Product added to favorites") {
        heartIcon.classList.add("favorited");
      } else if (response.data.message === "Product removed from favorites") {
        heartIcon.classList.remove("favorited");
      }
    })
    .catch((error) => {
      console.error("Error adding/removing product to/from favorites:", error);
    });
}



// work for logout 
const logoutLink = document.getElementById("logoutLink");

logoutLink.addEventListener("click", () => {
  // Make an API call to the logout endpoint
  axios
    .post("http://127.0.0.1:8000/api/logout", null, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`,
      },
    })
    .then((response) => {
      
      console.log(response.data.message);
      window.location.href = "sign_in.html"; 
    }) 
    .catch((error) => {
      
      console.error("Logout failed:", error);
    });
});







document.addEventListener("DOMContentLoaded", fetchProducts);
