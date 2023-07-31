// cart.js

// Function to create a cart item card
function createCartItemCard(cartItem, product) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cart-item-card");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("cart-item-image");
  const image = document.createElement("img");
  image.src = product.image_url;
  image.alt = product.name;
  imageContainer.appendChild(image);

  const productName = document.createElement("p");
  productName.textContent = product.name;
  productName.classList.add("cart-item-name");

//   const productPrice = document.createElement("p");
//   productPrice.textContent = `Price: $${product.price}`;
//   productPrice.classList.add("cart-item-price");

  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(productName);
//   cardContainer.appendChild(productPrice);

  return cardContainer;
}

// Function to fetch products data from the API
function fetchProducts() {
  return axios
    .get("http://127.0.0.1:8000/api/products", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching products:", error);
      return []; // Return an empty array in case of an error to handle gracefully
    });
}

// Function to fetch cart items data from the API
function fetchCartItems() {
//   const cartId = window.localStorage.getItem("cart_id");
//   if (!cartId) {
//     console.error("No cart ID found.");
//     return Promise.resolve([]); // Return an empty array as there is no cart ID
//   }

  return axios
    .get(`http://127.0.0.1:8000/api/cart_items`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`,
      },
    })
    .then((response) => response.data.cart_items)
    .catch((error) => {
      console.error("Error fetching cart items:", error);
      return []; // Return an empty array in case of an error to handle gracefully
    });
}

// Function to display cart items on the cart page
async function displayCartItems() {
  try {
    const cartItems = await fetchCartItems();
    const products = await fetchProducts();

    const cartContainer = document.getElementById("cartContainer");

    cartItems.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product_id);
      if (product) {
        const cartItemCard = createCartItemCard(cartItem, product);
        cartContainer.appendChild(cartItemCard);
      }
    });

    // Update the total item count
    document.getElementById("totalItem").textContent = `Total Items: ${cartItems.length}`;
  } catch (error) {
    console.error("Error displaying cart items:", error);
  }
}

// Fetch cart items and display them when the cart page loads
window.addEventListener("load", () => {
  displayCartItems();
});
