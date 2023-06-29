// Definition of the works API URL
const worksURL = 'http://localhost:5678/api/works';

// Array to store the works data
let worksData = [];

// Function that displays the gallery cards
const cards = (data) => {
  // Selecting the gallery element
  const gallery = document.querySelector('.gallery');
  
  // Resetting the gallery content
  gallery.innerHTML = '';

  // Iterating over the works data
  data.forEach(item => {
    // Creating a <figure> element for each work
    const figure = document.createElement('figure');
    
    // Adding the image and title to the <figure> element
    figure.innerHTML = `<img src="${item.imageUrl}"><p>${item.title}</p>`;
    
    // Adding the <figure> element to the gallery
    gallery.appendChild(figure);
  });
};

// Fetching the works from the API
fetch(worksURL)
  .then(response => response.json())
  .then(data => {
    // Storing the works data in the worksData array
    worksData = data;

    // Displaying all the works on page load
    cards(worksData);

    console.log(data[0]);
  })
  .catch(error => {
    console.error(error);
  });
