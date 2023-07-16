const worksURL = 'http://localhost:5678/api/works';
let worksData = [];
let imageActuelle = null; 

const afficherCartes = (data) => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  data.forEach(item => {
    const figure = document.createElement('figure');
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.classList.add('gallery-image'); 

    imageContainer.appendChild(image);
    figure.appendChild(imageContainer);

    const title = document.createElement('p');
    title.textContent = item.title;
    title.classList.add('gray-title'); 

    figure.appendChild(title);
    gallery.appendChild(figure);
  });
};


const filtrerGalerie = (categorie) => {
  let travauxFiltres = [];

  switch (categorie) {
    case 'all':
      travauxFiltres = worksData;
      break;
    case '1':
      travauxFiltres = worksData.filter(item => item.categoryId === 1);
      break;
    case '2':
      travauxFiltres = worksData.filter(item => item.categoryId === 2);
      break;
    case '3':
      travauxFiltres = worksData.filter(item => item.categoryId === 3);
      break;
    default:
      travauxFiltres = worksData;
  }

  afficherCartes(travauxFiltres);
};

const boutonsFiltre = document.querySelectorAll('.filter-button');
boutonsFiltre.forEach(bouton => {
  bouton.addEventListener('click', () => {
    const categorie = bouton.getAttribute('data-category');
    boutonsFiltre.forEach(btn => btn.classList.remove('filter-button--active'));
    bouton.classList.add('filter-button--active');
    filtrerGalerie(categorie);
  });
});

const afficherImagesModale = (data) => {
  const modalGalleryContainer = document.getElementById('modalGalleryContainer');
  modalGalleryContainer.innerHTML = '';

  data.forEach((item, index) => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const imgElement = document.createElement('img');
    imgElement.src = item.imageUrl;
    imgElement.classList.add('gallery-image');

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');

   
    deleteIcon.addEventListener('click', () => {
      supprimerImage(item.id); 
      imageContainer.remove(); 
      afficherCartes(worksData); 
    });

   
    imgElement.addEventListener('click', () => {
      mettreAJourImageActuelle(item.imageUrl);
    });

    if (index === 0) {
      const customIcon = document.createElement('i');
      customIcon.classList.add('fa-solid', 'fa-up-down-left-right');
      imageContainer.appendChild(customIcon);
    }

    imageContainer.appendChild(deleteIcon);
    imageContainer.appendChild(imgElement);

    const editSpan = document.createElement('span');
    editSpan.textContent = 'éditer';
    editSpan.classList.add('edit-span');

    imageContainer.appendChild(editSpan);
    modalGalleryContainer.appendChild(imageContainer);
  });
};

const openModalButton = (target) => {
  const modalId = target.dataset.target;
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
  const formContainer = document.querySelector('.formContainer');
  formContainer.classList.add('visible');
};

const modificationButtons = document.querySelectorAll('.openModalButton');
modificationButtons.forEach(button => {
  button.addEventListener('click', () => {
    openModalButton(button);
  });
});

const cacheBuster = Date.now(); 

fetch(`${worksURL}?_=${cacheBuster}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'If-None-Match': localStorage.getItem('etag') 
  }
})
  .then(response => {
    if (response.status === 304) {

      const cachedData = JSON.parse(localStorage.getItem('worksData'));
      worksData = cachedData;
      afficherCartes(worksData);
      console.log('Utilisation des données en cache');
      return;
    }
    if (!response.ok) {
      throw new Error('Erreur HTTP ' + response.status);
    }
    return response.json()
      .then(data => {
        worksData = data;
        afficherCartes(worksData);
        afficherImagesModale(worksData);
        localStorage.setItem('worksData', JSON.stringify(data)); 
        localStorage.setItem('etag', response.headers.get('etag')); 
        console.log(data[0]);
      });
  })
  .catch(error => {
    console.error(error);
  });



  const closeModalIcons = document.querySelectorAll('.closeModal');
  closeModalIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const modal = icon.closest('.modal');
      modal.style.display = 'none';
    });
  });


  const openModalButtons = document.querySelectorAll('.openModalButton');
  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-target');
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
    });
  });


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



const modalPopup = document.getElementById('modalPopup');
const gallery = document.querySelector('.gallery');
const submitButton = document.getElementById('submitButton');




const supprimerImage = (imageId) => {

  fetch(`${worksURL}/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  })
    .then(response => response.json())
    .then(data => {
      worksData = worksData.filter(item => item.id !== imageId);
      afficherImagesModale(worksData);
      afficherCartes(worksData);
    })
    .catch(error => {
      console.error(error);
    });
};

const fileUploadButton = document.getElementById('fileUpload');
const selectedImage = document.getElementById('selectedImage');

const title = document.getElementById('titleInput');


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
      const imageURL = URL.createObjectURL(file);
      selectedImage.style.backgroundImage = `url(${imageURL})`;
      console.log('Fichier sélectionné :', file);
      updateSubmitButtonState();
    }
  });

  fileInput.click();
});


function ajouterProjet() {

  const titreProjet = document.getElementById('titleInput').value;
  const imageUrl = selectedImage.style.backgroundImage.slice(4, -1).replace(/"/g, "");  


  if (titreProjet.trim() === '') {
    const msgError = document.getElementById('erreurTitre');
    msgError.innerHTML = 'Veuillez saisir un titre pour l\'image.';
    return;
  }


  const nouvelElementProjet = document.createElement('div');
  nouvelElementProjet.classList.add('projet');
  nouvelElementProjet.innerHTML = `
    <img src="${imageUrl}" alt="Image du projet" class="gallery-image">
    <h3>${titreProjet}</h3>
  `;


  const galerieProjet = document.querySelector('.gallery');
  galerieProjet.appendChild(nouvelElementProjet);

  
  document.getElementById('titleInput').value = '';
  selectedImage.style.backgroundImage = 'none';


  updateSubmitButtonState();


  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}


function ouvrirModal() {
  const modal = document.getElementById('modalPopup');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}


const boutonAjoutPhoto = document.getElementById('addImage');
boutonAjoutPhoto.addEventListener('click', ouvrirModal);

const boutonSoumission = document.getElementById('submitButton');
boutonSoumission.addEventListener('click', ajouterProjet);


var firstModal = document.getElementById("firstModal");
var closeModal = document.getElementsByClassName("closeModal")[0];
var modalWrapper = document.getElementsByClassName('modalWrapper');


function afficherFirstModal() {
  firstModal.style.display = "flex";
  modalPopup.style.display = "none";
  const modal = document.getElementById('modalPopup');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');


  const formContainer = document.querySelector('.formContainer');
  formContainer.style.display = 'none';
}


var arrowLeft = document.querySelector(".fa-solid.fa-arrow-left");

arrowLeft.addEventListener("click", afficherFirstModal);

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

let token = getCookie('token');


const titleInput = document.getElementById('titleInput');
const categorySelect = document.getElementById('category'); 


const updateSubmitButtonState = () => {
  const isTitleFilled = titleInput.value.trim() !== '';
  const isImageUploaded = selectedImage.style.backgroundImage !== 'none';
  const selectedCategoryValue = categorySelect.value; 
  const isCategorySelected = selectedCategoryValue === '1' || selectedCategoryValue === '2' || selectedCategoryValue === '3'; 

  if (isTitleFilled && isImageUploaded && isCategorySelected) {
    submitButton.classList.add('green-button');
  } else {
    submitButton.classList.remove('green-button');
  }
};


titleInput.addEventListener('input', updateSubmitButtonState);
selectedImage.addEventListener('DOMSubtreeModified', updateSubmitButtonState);
categorySelect.addEventListener('change', updateSubmitButtonState); 
