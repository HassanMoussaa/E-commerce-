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

  // Append elements to the card container
  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(productName);
  cardContainer.appendChild(productDescription);

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


document.addEventListener("DOMContentLoaded", fetchProducts);
