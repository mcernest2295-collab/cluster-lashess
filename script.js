```javascript
// ==================================
// CLUSTER LASHES BY YVONNE
// ==================================

// Yvonne's WhatsApp number
const WHATSAPP_NUMBER = "233241415612";

// SERVICE PRICES
const servicePrices = {
  "Natural Set": 28,
  "Classic Set": 35,
  "Wispy Set": 49,
  "Hybrid Set": 35,
  "Volume Set": 49,
  "Lash Refill": 17.50,
  "Lash Removal": 14
};

// ==================================
// MOBILE NAVIGATION
// ==================================

const menuButton = document.querySelector(".menu");
const navigation = document.querySelector("nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    navigation.classList.toggle("active");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");
    });
  });
}

// ==================================
// AUTOMATIC FOOTER YEAR
// ==================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ==================================
// BOOKING FORM
// ==================================

const bookingForm = document.getElementById("bookingForm");
const customerName = document.getElementById("customerName");
const serviceSelect = document.getElementById("serviceSelect");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");
const bookingSummary = document.getElementById("bookingSummary");
const bookingConfirmation = document.getElementById("bookingConfirmation");

// Set the earliest appointment date to today
if (appointmentDate) {
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  appointmentDate.min = localToday;
}

// ==================================
// UPDATE SERVICE PRICE
// ==================================

function updateBookingSummary() {
  if (!serviceSelect || !bookingSummary) return;

  const service = serviceSelect.value;
  const price = servicePrices[service];

  if (service && price !== undefined) {
    bookingSummary.textContent =
      `Selected service: ${service} — GHS ${price.toFixed(2)}`;
  } else {
    bookingSummary.textContent = "";
  }
}

if (serviceSelect) {
  serviceSelect.addEventListener("change", updateBookingSummary);
}

// ==================================
// SHOW BOOKING MESSAGE
// ==================================

function showBookingMessage(message, isError = false) {
  if (!bookingConfirmation) return;

  bookingConfirmation.textContent = message;
  bookingConfirmation.classList.add("show");

  if (isError) {
    bookingConfirmation.classList.add("error");
  } else {
    bookingConfirmation.classList.remove("error");
  }
}

// ==================================
// SEND BOOKING TO WHATSAPP
// ==================================

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = customerName.value.trim();
    const service = serviceSelect.value;
    const date = appointmentDate.value;
    const time = appointmentTime.value;
    const price = servicePrices[service];

    // Check required details
    if (!name || !service || !date || !time) {
      showBookingMessage(
        "Please complete all booking details before continuing.",
        true
      );
      return;
    }

    if (price === undefined) {
      showBookingMessage("Please choose a valid lash service.", true);
      return;
    }

    // Check that the date is not in the past
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showBookingMessage(
        "Please select today or a future appointment date.",
        true
      );
      return;
    }

    // Format appointment date
    const formattedDate = new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Create WhatsApp booking message
    const message =
      `Hello Yvonne! 👋\n\n` +
      `I would like to book a lash appointment.\n\n` +
      `👤 Name: ${name}\n` +
      `💖 Service: ${service}\n` +
      `💰 Price: GHS ${price.toFixed(2)}\n` +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Time: ${time}\n\n` +
      `Please confirm if this appointment is available. Thank you!`;

    // Create WhatsApp link
    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Show confirmation instructions
    showBookingMessage(
      "Your booking message is ready! Complete the process by sending it to Yvonne on WhatsApp."
    );

    // Open WhatsApp
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });
}
```
