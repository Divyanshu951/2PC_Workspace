// Get elements
const openPopupButton = document.getElementById('openPopup');
const closePopupButton = document.getElementById('closePopup');
const popup = document.getElementById('popup');

// Open the popup when the button is clicked
openPopupButton.addEventListener('click', function() {
  popup.style.display = 'flex';  // Use 'flex' to center the popup content
});

// Close the popup when the close button is clicked
closePopupButton.addEventListener('click', function() {
  popup.style.display = 'none';
});

// Close the popup when clicking outside the content area
window.addEventListener('click', function(event) {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});
