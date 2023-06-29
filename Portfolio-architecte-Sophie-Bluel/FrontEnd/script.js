// Set job API URL
const worksURL = 'http://localhost:5678/api/works';

// Array to store job data
let worksData = [];

// Function that displays the cards from the gallery
const cards = (data) => {

  const gallery = document.querySelector('.gallery');

  // Reset gallery content
  gallery.innerHTML = '';

  // Iterate over job data
  data.forEach(item => {
    // Create a <figure> element for each job
    const figure = document.createElement('figure');

    // Add image and title to the <figure> element
    figure.innerHTML = `<img src="${item.imageUrl}"><p>${item.title}</p>`;

    // Add the <figure> element to the gallery
    gallery.appendChild(figure);
  });
};

// Function that filters the gallery based on the selected category
const filterGallery = (category) => {
  let filteredWorks = [];

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

  cards(filteredWorks);
};

// Select filter buttons
const filterButtons = document.querySelectorAll('.filter-button');

// Listen for clicks on the filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the category of the clicked button
    const category = button.getAttribute('data-category');

    // Remove the active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('filter-button--active'));

    // Add the active class to the clicked button
    button.classList.add('filter-button--active');

    // Apply the filter based on the selected category
    filterGallery(category);
  });
});

// Fetch jobs from the API
fetch(worksURL, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    // Store job data in the worksData array
    worksData = data;

    // Display all jobs when the page loads
    cards(worksData);

    console.log(data[0]);
  })
  .catch(error => {
    console.error(error);
  });
