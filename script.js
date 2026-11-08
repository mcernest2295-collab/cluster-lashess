const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  nav.style.display = open ? "flex" : "none";
  if (open) {
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "78px";
    nav.style.right = "5%";
    nav.style.background = "#fff";
    nav.style.padding = "20px";
    nav.style.borderRadius = "15px";
    nav.style.boxShadow = "0 15px 35px #0002";
  }
});

document.querySelectorAll("nav a").forEach(a => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    if (window.innerWidth <= 800) nav.style.display = "none";
  });
});
