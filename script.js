const header = document.querySelector(".header");
const menuToggle = document.getElementById("menuToggle");
const menuNav = document.getElementById("menuNav");
const navLinks = document.querySelectorAll(".nav a");
const revealElements = document.querySelectorAll(".reveal");

// Muda o visual do header após rolar um pouco
function updateHeaderOnScroll() {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

updateHeaderOnScroll();
window.addEventListener("scroll", updateHeaderOnScroll);

// Abre e fecha menu no mobile
menuToggle.addEventListener("click", () => {
  const isOpen = menuNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Fecha o menu ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Revela elementos com fade-in quando entram na tela
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});

// Formulário de reserva com mensagem pronta no WhatsApp
const bookingForm = document.getElementById("bookingForm");

function formatDateToBr(dateValue) {
  if (!dateValue) return "";
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const guestName = String(formData.get("guestName") || "").trim();
    const checkinDate = String(formData.get("checkinDate") || "");
    const checkoutDate = String(formData.get("checkoutDate") || "");
    const guestCount = Number(formData.get("guestCount"));

    if (!guestName || !checkinDate || !checkoutDate || !guestCount) {
      alert("Preencha todos os campos para enviar no WhatsApp.");
      return;
    }

    if (guestCount < 1 || guestCount > 10) {
      alert("A casa recebe no máximo 10 pessoas.");
      return;
    }

    if (checkoutDate < checkinDate) {
      alert("O dia de volta deve ser igual ou depois do dia de ida.");
      return;
    }

    const message = [
      `Olá, meu nome é ${guestName}.`,
      "Tenho interesse em reservar a Casa Vista Ilhabela.",
      `Dia de ida: ${formatDateToBr(checkinDate)}.`,
      `Dia de volta: ${formatDateToBr(checkoutDate)}.`,
      `Pessoas: ${guestCount} (limite da casa: 10).`,
      "Pode me passar disponibilidade e valores?",
    ].join("\n");

    const whatsappNumber = "5512992090876";
    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappUrl;
  });
}
