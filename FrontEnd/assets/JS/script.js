// Define the base URL for the works API endpoint
const worksURL = 'http://localhost:5678/api/works';

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

// Fetch works data from the server
fetch(`${worksURL}?_=${cacheBuster}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'If-None-Match': localStorage.getItem('etag') 
  }
})
  .then(response => {
    // If the response status is 304 (Not Modified), use the cached data
    if (response.status === 304) {
      const cachedData = JSON.parse(localStorage.getItem('worksData'));
      worksData = cachedData;
      // Display the cached data in the gallery
      displayCards(worksData);
      console.log('Using cached data');
      return;
    }
    // If the response status is not OK, throw an error
    if (!response.ok) {
      throw new Error('HTTP Error ' + response.status);
    }
    // Parse the response data and update worksData, display the cards, and cache the data
    return response.json()
      .then(data => {
        worksData = data;
        displayCards(worksData);
        displayImagesModal(worksData);
        localStorage.setItem('worksData', JSON.stringify(data)); 
        localStorage.setItem('etag', response.headers.get('etag')); 
        console.log(data[0]);
      });
  })
  .catch(error => {
    console.error(error);
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
    .then(response => response.json())
    .then(data => {
      // Remove the deleted image from worksData and update the displayed images
      worksData = worksData.filter(item => item.id !== imageId);
      displayImagesModal(worksData);
      displayCards(worksData);
    })
    .catch(error => {
      console.error(error);
    });
};

// Add event listener to the fileUpload button to handle file selection
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

// Function to add a new project to the gallery
function addProject() {
  const projectTitle = document.getElementById('titleInput').value;
  const imageUrl = selectedImage.style.backgroundImage.slice(4, -1).replace(/"/g, ""); 

  if (projectTitle.trim() === '') {
    const errorMsg = document.getElementById('erreurTitre');
    errorMsg.innerHTML = 'Veuillez entrer un titre pour l\'image.';
    return;
  }

  // Create a new project element and append it to the gallery
  const newProjectElement = document.createElement('div');
  newProjectElement.classList.add('project');
  newProjectElement.innerHTML = `
    <img src="${imageUrl}" alt="Project image" class="gallery-image">
    <h3>${projectTitle}</h3>
  `;

  const projectGallery = document.querySelector('.gallery');
  projectGallery.appendChild(newProjectElement);

  // Clear input fields and reset the selected image
  document.getElementById('titleInput').value = '';
  selectedImage.style.backgroundImage = 'none';

  // Update the submit button state based on input validity
  updateSubmitButtonState();

  // Hide the modal after adding the project
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

// Function to open the modal when the addImage button is clicked
function openModal() {
  const modal = document.getElementById('modalPopup');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}

const addPhotoButton = document.getElementById('addImage');
addPhotoButton.addEventListener('click', openModal);

// Event listener for the submit button to add a new project
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', addProject);

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
let token = getCookie('token');
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



// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Check if the user is connected (has an adminToken)
  const isConnected = localStorage.getItem('adminToken') !== null;

  // Get the logout button and its container
  const logoutButton = document.getElementById('logout-button');
  const logoutButtonContainer = document.querySelector('.connected');

  // Function to handle logout
  const handleLogout = () => {
    // Remove the adminToken from localStorage and refresh the page
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  // Add click event listener for the logout button
  logoutButton.addEventListener('click', handleLogout);

  // Show or hide the logout button container based on whether the user is connected or not
  if (isConnected) {
    logoutButtonContainer.style.display = 'block';
  } else {
    logoutButtonContainer.style.display = 'none';
  }
});

// Function to handle logout
const handleLogout = () => {
  // Remove the adminToken from localStorage and refresh the page
  localStorage.removeItem('adminToken');
  window.location.reload();
};

// Function to show or hide elements based on the user's connection status
const toggleConnectedElements = () => {
  const isConnected = localStorage.getItem('adminToken') !== null;
  const elementsToToggle = document.querySelectorAll('.openModalButton');
  const logoutButtonContainer = document.querySelector('.connected');
  const bordereauContainer = document.getElementById('bordereau-container');
  const loginLi = document.querySelector('.login-btn');

  logoutButtonContainer.style.display = isConnected ? 'block' : 'none';
  bordereauContainer.style.display = isConnected ? 'flex' : 'none';
  
  elementsToToggle.forEach(element => {
    element.style.display = isConnected ? 'flex' : 'none';
  });

  loginLi.style.display = isConnected ? 'none' : 'block'; // Show the login button if not connected, hide it if connected
};


document.addEventListener('DOMContentLoaded', () => {
  toggleConnectedElements();

  // Add click event listener for the logout button
  document.getElementById('logout-button').addEventListener('click', handleLogout);
});

