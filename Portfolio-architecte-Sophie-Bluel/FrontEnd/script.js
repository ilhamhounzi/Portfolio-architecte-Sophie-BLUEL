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

  const openModalButtons = document.querySelectorAll('.openModalButton');
  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-target');
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
    });
  });


// Fonction pour supprimer une image
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
