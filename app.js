// new features
// 1.Added Selected Image count
// 2.Added spinner
// 3.If input is empty or invalid show error Message
// 4.If selected images less than 2 show error message


const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
const errorDetailsInfo = document.getElementById("error");
const alert = document.getElementById('alert');
// selected image 
let sliders = [];
var timer;


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.total == 0) {
    errorHandler();
    toggleSpinner();
  } else {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.hits.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  }
  toggleSpinner();
}
// get images
const getImages = (query) => {
  document.getElementById('alert').classList.add('d-none');
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty`)
    .then(response => response.json())
    .then(data => showImages(data))
    .catch(error => errorHandler(error))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.toggle('added');
    sliders.push(img);
    document.getElementById('count').innerText = sliders.length;
  } else {
    element.classList.toggle('added');
    sliders.pop(img);
    document.getElementById('count').innerText = sliders.length;
  }
}
// create slider
const createSlider = () => {
  search.value = '';
  // galleryHeader.innerHTML = '';
  // check slider image length
  if (sliders.length < 2) {
    errorDetailsInfo.style.display = 'none';
    alert.classList.remove('d-none');
    toggleSpinner();
    sliders = [];
    return;
  }
  // create slider previous next area
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  if (duration < 0 || !(duration > 1000)) {
    duration = 1000;
  }
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  toggleSpinner();
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration)
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })
  items[index].style.display = "block"
}

search.addEventListener("keypress", function (event) {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});
// search Images
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  document.getElementById('count').innerText = '';
  clearInterval(timer);
  if (search.value != '') {
    errorDetailsInfo.style.display = 'none';
    getImages(search.value)
  } else {
    
    errorHandler();
    toggleSpinner();
  }
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  toggleSpinner();
  createSlider();
})

// spinner display
const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none');
}
// error handling
const errorHandler = () => {
  alert.style.display = 'none';
  errorDetailsInfo.style.display = 'block';
  toggleSpinner();
}