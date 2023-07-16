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

