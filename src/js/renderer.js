const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

// iOS Logo İçin
const appStoreIconCheckbox = document.querySelector('#appstore-icon');
const iphoneNotification2xCheckbox = document.querySelector('#iphone-notification-2x');
const iphoneNotification3xCheckbox = document.querySelector('#iphone-notification-3x');
const iphoneSettings2xCheckbox = document.querySelector('#iphone-settings-2x');
const iphoneSettings3xCheckbox = document.querySelector('#iphone-settings-3x');
const iphoneSpotlight2xCheckbox = document.querySelector('#iphone-spotlight-2x');
const iphoneSpotlight3xCheckbox = document.querySelector('#iphone-spotlight-3x');
const iphoneApp2xCheckbox = document.querySelector('#iphone-app-2x');
const iphoneApp3xCheckbox = document.querySelector('#iphone-app-3x');


// Android Logo İçin
const mdpiNormalCheckbox = document.querySelector('#mdpi-normal');
const mdpiRoundedCheckbox = document.querySelector('#mdpi-rounded');
const hdpiNormalCheckbox = document.querySelector('#hdpi-normal');
const hdpiRoundedCheckbox = document.querySelector('#hdpi-rounded');
const xhdpiNormalCheckbox = document.querySelector('#xhdpi-normal');
const xhdpiRoundedCheckbox = document.querySelector('#xhdpi-rounded');
const xxhdpiNormalCheckbox = document.querySelector('#xxhdpi-normal');
const xxhdpiRoundedCheckbox = document.querySelector('#xxhdpi-rounded');
const xxxhdpiNormalCheckbox = document.querySelector('#xxxhdpi-normal');
const xxxhdpiRoundedCheckbox = document.querySelector('#xxxhdpi-rounded');


// Load image and show form
function loadImage(e) {
  const file = e.target.files[0];

  // Check if file is an image
  if (!isFileImage(file)) {
    alertError('Please select an image');
    return;
  }

  // Add current height and width to form using the URL API
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.innerHTML = this.width;
    heightInput.innerHTML = this.height;
  };

  // Show form, image name and output path
  form.style.display = 'block';
  filename.innerHTML = img.files[0].name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

// Make sure file is an image
function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
}

// Resize image
function resizeImage(e) {
  e.preventDefault();

  const selectedOptions = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox)=>{selectedOptions.push(checkbox.value)});

  if (!img.files[0]) {
    alertError('Please upload an image');
    return;
  }

  if (widthInput.value === '' || heightInput.value === '') {
    alertError('Please enter a width and height');
    return;
  }
  const imgPath = img.files[0].path;
  
  ipcRenderer.send('image:resize', {
    imgPath,
    selectedOptions,
  });
}

// When done, show message
ipcRenderer.on('image:done', () =>
  alertSuccess(`Image resized successfully and saved to output path `)
);

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

// File select listener
img.addEventListener('change', loadImage);
// Form submit listener
form.addEventListener('submit', resizeImage);





// function selectedOptions(){
//   const selectedOptions = [];
//   const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
//   checkboxes.forEach(function(checkbox) {
//     selectedOptions.push(checkbox.value);
//   });
//   console.log('Seçili seçenekler:', selectedOptions);
// }