//Nav Bar
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => [
  btn.classList.toggle("open"),
  nav.classList.toggle("flex"),
  nav.classList.toggle("hidden"),
]);
//Dark Mode
const moonIcon = document.querySelector(".moon-icon");
const sunIcon = document.querySelector(".sun-icon");

//Save what the user chooses and target his selection.
const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

//Icon toggle
const iconToggle = () => {
  moonIcon.classList.toggle("hidden");
  sunIcon.classList.toggle("hidden");
};

//Initial Theme Check
const themeCheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moonIcon.classList.add("hidden");
    return;
  }
  sunIcon.classList.add("hidden");
};

//Manually switch the theme
const themeSwitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    iconToggle();
    return;
  }
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
  iconToggle();
};

//Call theme switch when the button is clicked
moonIcon.addEventListener("click", () => {
  themeSwitch();
});
sunIcon.addEventListener("click", () => {
  themeSwitch();
});

//Check theme on initial load
themeCheck();

//Hero section 
let slideImg = document.getElementById("slideImg");
let images = new Array (
  "../Images/forex.jpg",
  "../Images/loan.jpg",
  "../Images/rocket.jpg"
);
let len = images.length;
let i = 0;
slider = () => {
  if (i > len - 1){
    i = 0;
  }
  slideImg.src = images[i];
  i++;
  setTimeout("slider()", 5000);
}

// For The Animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("unhide");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hide");
hiddenElements.forEach((el) => observer.observe(el));

//Testimonial Section
var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
  },
});

//Contact Us 
const complaintField = document.getElementById("message");

complaintField.addEventListener("input", function() {
  if (complaintField.value.length < 50) {
    complaintField.setCustomValidity("Your complaint message should be at least 50 characters long.");
  } else if (complaintField.value.length > 1000) {
    complaintField.setCustomValidity("Your complaint message should be no more than 1000 characters long.");
  } else {
    complaintField.setCustomValidity("");
  }
});
