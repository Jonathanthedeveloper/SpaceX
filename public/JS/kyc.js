//For the Green Icons
//Name
const myName = document.getElementById("name");
myName.addEventListener("change", function() {
  if (myName.value) {
    const icon = document.getElementById('nameIcon')
    icon.classList.remove('hidden');
  }
});
//Address
const myAddress = document.getElementById("address");
myAddress.addEventListener("change", function() {
  if (myAddress.value) {
    const icon = document.getElementById('addressIcon')
    icon.classList.remove('hidden');
  }
});
//City
const myCity = document.getElementById("city");
myCity.addEventListener("change", function() {
  if (myCity.value) {
    const icon = document.getElementById('cityIcon')
    icon.classList.remove('hidden');
  }
});
//State
const myState = document.getElementById("state");
myState.addEventListener("change", function() {
  if (myState.value) {
    const icon = document.getElementById('stateIcon')
    icon.classList.remove('hidden');
  }
});
//Country
const myCountry = document.getElementById("country");
myCountry.addEventListener("change", function() {
  if (myCountry.value) {
    const icon = document.getElementById('countryIcon')
    icon.classList.remove('hidden');
  }
});
//Gender
document.getElementById("genderDiv").addEventListener("click", () => {
if (document.getElementById("male").checked) {
    const icon = document.getElementById('genderIcon')
    icon.classList.remove('hidden');
  } else if (document.getElementById("female").checked) {
    const icon = document.getElementById('genderIcon')
    icon.classList.remove('hidden');
  }
})

//Input Field
function displayFileName() {
    const input = document.getElementById('myFileInput');
    const label = document.getElementById('fileInputLabel');
    const fileName = input.value.split('\\').pop();
    label.innerHTML = fileName;
  }
  
  function displayFileName1() {
    const input = document.getElementById('myFileInput1');
    const label = document.getElementById('fileInputLabel1');
    const fileName = input.value.split('\\').pop();
    label.innerHTML = fileName;
  }
  