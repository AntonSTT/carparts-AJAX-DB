const scrollToTopButton = document.getElementById("scrollbtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 250) {
    scrollToTopButton.classList.add("showBtn")
  } else {
    scrollToTopButton.classList.remove("showBtn")
  }
});
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
