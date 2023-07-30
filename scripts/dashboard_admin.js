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

// delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    deleteProduct(product.id);
  });

  // update button
  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.classList.add("update-button");
  updateButton.addEventListener("click", () => {
    
    openModal(product.id);
  });

  // Append elements to the card container
  cardContainer.appendChild(imageContainer);
  cardContainer.appendChild(productName);
  cardContainer.appendChild(productDescription);
  cardContainer.appendChild(deleteButton);
  cardContainer.appendChild(updateButton);

  return cardContainer;
}

// Function to populate the product container
function populateProductContainer(containerId, products) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; 

  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Function to fetch products data from the API
function fetchProducts() {
  axios
    .get("http://127.0.0.1:8000/api/products", {headers:{
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

// for delete product 
function deleteProduct(productId) {
  axios
    .delete(`http://127.0.0.1:8000/api/products/delete/${productId}`,{headers:{
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`
    }})
    .then((response) => {
      console.log("", response.data.message);
      
      fetchProducts();
    })
    .catch((error) => {
      console.error("Failed to delete product:", error);
    });
}


//part for update 
// Update the openModal function to accept the product ID as a parameter
function openModal(productId) {
  const modal = document.getElementById("modal");
  const closeButton = document.getElementsByClassName("close")[0];
  const updateButton = document.getElementById("modalUpdateButton");
  const productNameInput = document.getElementById("productName");
  const productImageInput = document.getElementById("productImage");
  const productDescriptionInput = document.getElementById("productDescription");
  const productCategoryInput = document.getElementById("productCategory");

 
  modal.style.display = "block";

 
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  
  updateButton.onclick = function () {
    const updatedProduct = {
      name: productNameInput.value,
      description: productDescriptionInput.value,
      category_id: productCategoryInput.value,
    };

   
    const imageFile = productImageInput.files[0];
    console.log
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", updatedProduct.name);
      formData.append("description", updatedProduct.description);
      formData.append("category_id", updatedProduct.category_id);
      updateProduct(productId, formData);
    } else {
      updateProduct(productId, updatedProduct);
    }
    modal.style.display = "none";
  };
}

function updateProduct(productId, formData) {
  axios
    .put(`http://127.0.0.1:8000/api/products/update/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${window.localStorage.getItem("jwt_token")}`,
      },
    })
    .then((response) => {
      console.log(response.data.message);
      closeModal();
      fetchProducts();
    })
    .catch((error) => {
      console.error(error);
    });
}



document.addEventListener("DOMContentLoaded", fetchProducts);
