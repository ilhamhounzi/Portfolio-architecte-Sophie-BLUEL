// Define the base URL for the works API endpoint
const worksURL = 'http://localhost:5678/api/works';
const categoriesURL = 'http://localhost:5678/api/categories'; // Define the categories URL


// Array to store the fetched works data
let worksData = [];

// Represents the currently selected image
let currentImage = null;

// Function to display cards in the gallery based on the provided data
const displayCards = (data) => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  // Iterate through each work item in the data
  data.forEach(item => {
    const figure = document.createElement('figure');
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    // Create an image element and set its source from the item's imageUrl
    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.classList.add('gallery-image'); 

    // Append the image element to the imageContainer
    imageContainer.appendChild(image);
    figure.appendChild(imageContainer);

    // Create a paragraph element for the work title and add it to the figure
    const title = document.createElement('p');
    title.textContent = item.title;
    title.classList.add('gray-title'); 
    figure.appendChild(title);

    // Add the figure element to the gallery
    gallery.appendChild(figure);
  });
};

// Function to fetch categories from the API
const fetchCategories = () => {
  fetch(categoriesURL)
    .then(response => response.json())
    .then(categories => {
      const categorySelect = document.getElementById('category');
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
};

// Function to filter the gallery based on the selected category
const filterGallery = (category) => {
  let filteredWorks = [];

  // Switch statement to determine the filteredWorks array based on the selected category
  switch (category) {
    case 'all':
      filteredWorks = worksData;
      break;
    case '1':
      filteredWorks = worksData.filter(item => item.categoryId === 1);
      break;
    case '2':
      filteredWorks = worksData.filter(item => item.categoryId === 2);
      break;
    case '3':
      filteredWorks = worksData.filter(item => item.categoryId === 3);
      break;
    default:
      filteredWorks = worksData;
  }

  // Display the filtered works in the gallery
  displayCards(filteredWorks);
};

document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display categories
  fetchCategories();

  // Select all filter buttons and add click event listeners
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the category value from the data-category attribute of the clicked button
      const category = button.getAttribute('data-category');
      // Remove the 'filter-button--active' class from all buttons and add it to the clicked button
      filterButtons.forEach(btn => btn.classList.remove('filter-button--active'));
      button.classList.add('filter-button--active');
      // Filter the gallery based on the selected category
      filterGallery(category);
    });
  });
});


// Function to display images in the modal based on the provided data
const displayImagesModal = (data) => {
  const modalGalleryContainer = document.getElementById('modalGalleryContainer');
  modalGalleryContainer.innerHTML = '';

  // Iterate through each image item in the data
  data.forEach((item, index) => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    // Create an image element and set its source from the item's imageUrl
    const imgElement = document.createElement('img');
    imgElement.src = item.imageUrl;
    imgElement.classList.add('gallery-image'); 

    // Create a delete icon for each image
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');

    // Event listener for the delete icon to remove the image when clicked
    deleteIcon.addEventListener('click', () => {
      deleteImage(item.id); 
      imageContainer.remove(); 
      // Update the cards in the gallery after deleting the image
      displayCards(worksData); 
    });

    // Event listener for the image to update the currently selected image when clicked
    imgElement.addEventListener('click', () => {
      updateCurrentImage(item.imageUrl);
    });

    // Add a custom icon to the first image container
    if (index === 0) {
      const customIcon = document.createElement('i');
      customIcon.classList.add('fa-solid', 'fa-up-down-left-right');
      imageContainer.appendChild(customIcon);
    }

    // Append the delete icon and image to the image container
    imageContainer.appendChild(deleteIcon);
    imageContainer.appendChild(imgElement);

    // Create a span for editing and append it to the image container
    const editSpan = document.createElement('span');
    editSpan.textContent = 'edit';
    editSpan.classList.add('edit-span');
    imageContainer.appendChild(editSpan);

    // Add the image container to the modalGalleryContainer
    modalGalleryContainer.appendChild(imageContainer);
  });
};

// Function to open a specific modal based on the target dataset
const openModalButton = (target) => {
  const modalId = target.dataset.target;
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
  const formContainer = document.querySelector('.formContainer');
  formContainer.classList.add('visible');
};

// Select all edit buttons and add click event listeners
const editButtons = document.querySelectorAll('.openModalButton');
editButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Call the openModalButton function when an edit button is clicked
    openModalButton(button);
  });
});

// Generate a cache buster timestamp to ensure fresh data is fetched from the server
const cacheBuster = Date.now();

fetch(`${worksURL}?_=${cacheBuster}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'If-None-Match': localStorage.getItem('etag'),
  },
})
  .then(response => {
 if (response.status === 304) {
  const cachedData = JSON.parse(localStorage.getItem('worksData'));
  worksData = cachedData;
  displayCards(worksData);
  console.log('Données en cache utilisées');
  return;
}

    if (!response.ok) {
      throw new Error('Erreur HTTP ' + response.status);
    }

    // Parse the response as JSON
    return response.json()
      .then(data => {

worksData = data;

localStorage.setItem('worksData', JSON.stringify(worksData));

        displayCards(worksData);
        displayImagesModal(worksData);

        // Mettre à jour le cache avec l'en-tête etag
        const etag = response.headers.get('etag'); // Utiliser response.headers.get
        localStorage.setItem('worksData', JSON.stringify(data));
        localStorage.setItem('etag', etag);

        console.log(data[0]);
      });
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function() {
  const addImageButton = document.getElementById("addImage");
  const formContainer = document.querySelector(".formContainer");

  // Show the form container when the add image button is clicked
  addImageButton.addEventListener("click", function() {
    formContainer.style.display = "block";
  });

  // Add event listeners to all closeModal icons to hide their corresponding modals
  const closeModalIcons = document.querySelectorAll('.closeModal');
  closeModalIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const modal = icon.closest('.modal');
      modal.style.display = 'none';
    });
  });

  // Function to hide the gallery
  const hideGallery = () => {
    const titleModal = document.getElementById('titleModal');
    const modalGalleryContainer = document.getElementById('modalGalleryContainer');
    const borderLine = document.querySelector('.borderLine');
    const addImageBtn = document.getElementById('addImage');
    const imageDeleteLink = document.querySelector('.image-delete');

    titleModal.style.display = 'none';
    modalGalleryContainer.style.display = 'none';
    borderLine.style.display = 'none';
    addImageBtn.style.display = 'none';
    imageDeleteLink.style.display = 'none';
  };

  // Add event listeners to all openModalButton elements to open their corresponding modals
  const openModalButtons = document.querySelectorAll('.openModalButton');
  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-target');
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
    });
  });

  // Close the modal when clicking outside of it
  window.addEventListener('mousedown', (event) => {
    const formContainer = document.querySelector('.formContainer');
    const firstModal = document.getElementById('firstModal');
    if (
      event.target === formContainer ||
      event.target === firstModal ||
      formContainer.contains(event.target) ||
      firstModal.contains(event.target)
    ) {
      return;
    }

    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
  });
});

// Function to open the modal when the addImage button is clicked
const modalPopup = document.getElementById('modalPopup');
const gallery = document.querySelector('.gallery');
const addImageButton = document.getElementById('addImage');

addImageButton.addEventListener('click', function() {
  const firstModal = document.getElementById('firstModal');
  firstModal.style.display = 'none';
});

// Function to delete an image by its ID
const deleteImage = (imageId) => {
  fetch(`${worksURL}/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.status === 204) {
      // Successful deletion, update the displayed images
      worksData = worksData.filter(item => item.id !== imageId);
      displayImagesModal(worksData);
      displayCards(worksData); // Update the main gallery
      
      // Close the modal if the currently selected image is deleted
      if (currentImage && currentImage.id === imageId) {
        closeImageModal();
      }
    } else {
      throw new Error('Failed to delete image');
    }
  })
  .catch(error => {
    console.error('Error deleting image:', error);
  });
};

    // Close the modal if the currently selected image is deleted
    if (currentImage && currentImage.id === imageId) {
      
const closeImageModal = () => {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  currentImage = null;
};
    }

const fileUploadButton = document.getElementById('fileUpload');
const selectedImage = document.getElementById('selectedImage');
const titleInput = document.getElementById('titleInput');
const validateButton = document.getElementById('validateButton');

fileUploadButton.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.id = 'newImage';
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      // Display the selected image in the preview section
      const imageURL = URL.createObjectURL(file);
      selectedImage.style.backgroundImage = `url(${imageURL})`;
      console.log('Selected file:', file);
      // Update the submit button state based on input validity
      updateSubmitButtonState();
    }
  });

  fileInput.click();
});

// Event listener for the submit button to add a new project
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  addProject(); 
});
function addProject() {
  const projectTitle = document.getElementById('titleInput').value;
  const fileInput = document.getElementById('newImage');
  const file = fileInput.files[0]; // Get the selected image file
  const categoryId = document.getElementById('category').value;

  console.log("projectTitle:", projectTitle);
  console.log("file:", file);
  console.log("categoryId:", categoryId);

  if (projectTitle.trim() === '' || !file || !categoryId) {
    const errorMsg = document.getElementById('erreurTitre');
    errorMsg.innerHTML = 'Veuillez remplir tous les champs.';
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', projectTitle);
  formData.append('category', categoryId);

  fetch(worksURL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP Error ' + response.status);
    }
    return response.json(); // Parse and return the response JSON
  })
  .then(data => {
    // Handle the response data here if needed
    console.log('New project added:', data);

    // Add the new project to worksData and update the displayed images
    worksData.push(data);
    displayImagesModal(worksData);
    displayCards(worksData);
    
    // Hide the modal
    const modal = document.getElementById('modalPopup');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  })
  .catch(error => {
    console.error('Error adding project:', error);
  });
}

// Function to open the modal when the addImage button is clicked
function openModal() {
  const modal = document.getElementById('modalPopup');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}

const addPhotoButton = document.getElementById('addImage');
addPhotoButton.addEventListener('click', openModal);


// Get the first modal, close modal icon, and modal wrapper elements
const firstModal = document.getElementById("firstModal");
const closeModal = document.getElementsByClassName("closeModal")[0];
const modalWrapper = document.getElementsByClassName('modalWrapper');

// Function to show the first modal
function showFirstModal() {
  firstModal.style.display = "flex";
  modalPopup.style.display = "none";
  const modal = document.getElementById('modalPopup');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');

  const formContainer = document.querySelector('.formContainer');
  formContainer.style.display = 'none';
}

// Add event listener for arrowLeft icon to show the first modal
const arrowLeft = document.querySelector(".fa-solid.fa-arrow-left");
arrowLeft.addEventListener("click", showFirstModal);

// Function to get a cookie by name
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return '';
}

// Get the authentication token from cookies
let token = localStorage.getItem('adminToken');
const categorySelect = document.getElementById('category'); 

// Function to update the submit button state based on input validity

const updateSubmitButtonState = () => {
  const isTitleFilled = titleInput.value.trim() !== '';
  const isImageUploaded = selectedImage.style.backgroundImage !== 'none';
  const selectedCategoryValue = categorySelect.value; 
  const isCategorySelected = selectedCategoryValue === '1' || selectedCategoryValue === '2' || selectedCategoryValue === '3'; 

  if (isTitleFilled && isImageUploaded && isCategorySelected) {
    // Add a green-button class to the submit button when all conditions are met
    submitButton.classList.add('green-button');
  } else {
    // Remove the green-button class from the submit button when conditions are not met
    submitButton.classList.remove('green-button');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Check if the user is connected (has an adminToken)
  const isConnected = localStorage.getItem('adminToken') !== null;

  // Get the logout button and its container
  const logoutButton = document.getElementById('logout-button');
  const loginButton = document.getElementById('login-btn');
  const filterButtons = document.querySelectorAll('.filter-button');
  const addImageButton = document.getElementById('addImage');
  const editButtons = document.querySelectorAll('.openModalButton');

  // Toggle visibility of login button and filter buttons
  if (isConnected) {
    logoutButton.style.display = 'block';
    loginButton.style.display = 'none';
    filterButtons.forEach(button => {
      button.style.display = 'none';
    });
    addImageButton.style.display = 'none';
    editButtons.forEach(button => {
      button.style.display = 'none';
    });
  } else {
    logoutButton.style.display = 'none';
    loginButton.style.display = 'block';
    filterButtons.forEach(button => {
      button.style.display = 'block';
    });
    addImageButton.style.display = 'block';
    editButtons.forEach(button => {
      button.style.display = 'flex';
    });
  }


  // Event listener for the logout button
  document.getElementById('logout-button').addEventListener('click', handleLogout);
});


// Function to handle logout
const handleLogout = () => {
  // Remove the adminToken from localStorage and refresh the page
  localStorage.removeItem('adminToken');
  window.location.reload();
};

// Function to toggle connected elements
const toggleConnectedElements = () => {
  const isConnected = localStorage.getItem('adminToken') !== null;
  const filterButtons = document.querySelectorAll('.filter-button');
  const logoutButtonContainer = document.querySelector('.connected');
  const bordereauContainer = document.getElementById('bordereau-container');
  const loginLi = document.querySelector('.login-btn');
  const elementsToToggle = document.querySelectorAll('.openModalButton');

  logoutButtonContainer.style.display = isConnected ? 'block' : 'none';
  bordereauContainer.style.display = isConnected ? 'flex' : 'none';
  

  filterButtons.forEach(button => {
    button.style.display = isConnected ? 'none' : 'block';
  });

  elementsToToggle.forEach(element => {
    element.style.display = isConnected ? 'flex' : 'none';
  });

  loginLi.style.display = isConnected ? 'none' : 'block';
};

// Call the function to toggle elements when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  toggleConnectedElements();

  // Add click event listener for the logout button
  document.getElementById('logout-button').addEventListener('click', handleLogout);

  // Add click event listener for the "Add Image" button
  document.getElementById('addImage').addEventListener('click', () => {
    const firstModal = document.getElementById('firstModal');
    firstModal.style.display = 'none';
  });
  
  // Add click event listener for the "edit" buttons 
  const editButtons = document.querySelectorAll('.openModalButton');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      openModalButton(button);
    });
  });

  // Add event listener for input changes to update submit button state
   titleInput.addEventListener('input', updateSubmitButtonState);
  categorySelect.addEventListener('input', updateSubmitButtonState); // Change event to input
  selectedImage.addEventListener('input', updateSubmitButtonState); // Change event to input


// Call the function to toggle elements when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  toggleConnectedElements();

  // Add click event listener for the logout button
  document.getElementById('logout-button').addEventListener('click', handleLogout);
});
});
