
// =====================================
// CLUSTER LASHES BY YVONNE
// WHATSAPP BOOKING SYSTEM
// =====================================

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

// =====================================
// MOBILE NAVIGATION
// =====================================

const menuButton = document.querySelector(".menu");
const navigation = document.querySelector("nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    navigation.classList.toggle("active");
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");
    });
  });
}

// =====================================
// FOOTER YEAR
// =====================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// =====================================
// BOOKING ELEMENTS
// =====================================

const bookingForm = document.getElementById("bookingForm");
const customerName = document.getElementById("customerName");
const serviceSelect = document.getElementById("serviceSelect");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");
const bookingSummary = document.getElementById("bookingSummary");
const bookingConfirmation = document.getElementById("bookingConfirmation");

// =====================================
// PREVENT PAST APPOINTMENT DATES
// =====================================

if (appointmentDate) {
  const now = new Date();

  const today = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  appointmentDate.min = today;
}

// =====================================
// SHOW SELECTED SERVICE PRICE
// =====================================

function updateBookingSummary() {
  if (!serviceSelect || !bookingSummary) return;

  const service = serviceSelect.value;
  const price = servicePrices[service];

  if (service && price !== undefined) {
    bookingSummary.textContent =
      `Your selected service: ${service} — GHS ${price.toFixed(2)}`;
  } else {
    bookingSummary.textContent = "";
  }
}

if (serviceSelect) {
  serviceSelect.addEventListener("change", updateBookingSummary);
}

// =====================================
// DISPLAY MESSAGES
// =====================================

function showBookingMessage(message, error = false) {
  if (!bookingConfirmation) return;

  bookingConfirmation.textContent = message;
  bookingConfirmation.classList.add("show");

  if (error) {
    bookingConfirmation.classList.add("error");
  } else {
    bookingConfirmation.classList.remove("error");
  }
}

// =====================================
// WHATSAPP BOOKING
// =====================================

if (bookingForm) {

  bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = customerName.value.trim();
    const service = serviceSelect.value;
    const date = appointmentDate.value;
    const time = appointmentTime.value;

    const price = servicePrices[service];

    // CHECK CUSTOMER DETAILS
    if (!name || !service || !date || !time) {
      showBookingMessage(
        "Please complete all the booking details.",
        true
      );
      return;
    }

    // CHECK SERVICE
    if (price === undefined) {
      showBookingMessage(
        "Please select a valid lash service.",
        true
      );
      return;
    }

    // CHECK APPOINTMENT DATE
    const selectedDate = new Date(date + "T00:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showBookingMessage(
        "Please choose today or a future date.",
        true
      );
      return;
    }

    // FORMAT DATE
    const formattedDate = selectedDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

    // CREATE WHATSAPP MESSAGE
    const message =
      "Hello Yvonne! I would like to book a lash appointment.\n\n" +
      "Customer Name: " + name + "\n" +
      "Service: " + service + "\n" +
      "Price: GHS " + price.toFixed(2) + "\n" +
      "Appointment Date: " + formattedDate + "\n" +
      "Appointment Time: " + time + "\n\n" +
      "Please confirm if this appointment is available. Thank you!";

    // CREATE WHATSAPP LINK
    const whatsappLink =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    // SHOW MESSAGE
    showBookingMessage(
      "Your booking details are ready. WhatsApp is opening so you can send your request to Yvonne."
    );

    // OPEN WHATSAPP
    window.open(whatsappLink, "_blank");

  });

}

```
