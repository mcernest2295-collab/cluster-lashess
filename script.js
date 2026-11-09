
// =====================================
// CLUSTER LASHES BY YVONNE
// WHATSAPP BOOKING SYSTEM
// =====================================

const WHATSAPP_NUMBER = "233241415612";

const servicePrices = {
  "Natural Set": 28,
  "Classic Set": 35,
  "Wispy Set": 49,
  "Hybrid Set": 35,
  "Volume Set": 49,
  "Lash Refill": 17.50,
  "Lash Removal": 14
};

// MOBILE NAVIGATION

const menuButton = document.querySelector(".menu");
const navigation = document.querySelector(".nav nav");

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

// FOOTER YEAR

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// BOOKING ELEMENTS

const bookingForm = document.getElementById("bookingForm");
const customerName = document.getElementById("customerName");
const serviceSelect = document.getElementById("serviceSelect");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");
const bookingSummary = document.getElementById("bookingSummary");
const bookingConfirmation = document.getElementById("bookingConfirmation");
const whatsappButton = document.getElementById("whatsappButton");

// BUTTON TEXT

if (whatsappButton) {
  whatsappButton.textContent = "Book on WhatsApp";
}

// TODAY'S DATE

function getTodayDate() {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
}

if (appointmentDate) {
  appointmentDate.min = getTodayDate();
}

// SERVICE PRICE SUMMARY

function updateBookingSummary() {
  if (!serviceSelect || !bookingSummary) return;

  const service = serviceSelect.value;
  const price = servicePrices[service];

  bookingSummary.textContent =
    service && price !== undefined
      ? `Your selected service: ${service} — GHS ${price.toFixed(2)}`
      : "";
}

if (serviceSelect) {
  serviceSelect.addEventListener("change", updateBookingSummary);
}

// BOOKING MESSAGE

function showBookingMessage(message, error = false) {
  if (!bookingConfirmation) return;

  bookingConfirmation.replaceChildren();
  bookingConfirmation.textContent = message;
  bookingConfirmation.classList.add("show");
  bookingConfirmation.classList.toggle("error", error);
}

// WHATSAPP BOOKING

if (bookingForm) {
  bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (
      !customerName ||
      !serviceSelect ||
      !appointmentDate ||
      !appointmentTime
    ) {
      showBookingMessage("Booking form is not configured correctly.", true);
      return;
    }

    const name = customerName.value.trim();
    const service = serviceSelect.value;
    const date = appointmentDate.value;
    const time = appointmentTime.value;
    const price = servicePrices[service];

    if (!name || !service || !date || !time) {
      showBookingMessage("Please complete all the booking details.", true);
      return;
    }

    if (price === undefined) {
      showBookingMessage("Please select a valid lash service.", true);
      return;
    }

    if (date < getTodayDate()) {
      showBookingMessage("Please choose today or a future date.", true);
      return;
    }

    const selectedDate = new Date(date + "T00:00:00");

    const formattedDate = selectedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const [hours, minutes] = time.split(":");

    const formattedTime = new Date(
      2000, 0, 1, Number(hours), Number(minutes)
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    const message =
      "Hello Yvonne! I would like to book a lash appointment.\n\n" +
      "Customer Name: " + name + "\n" +
      "Service: " + service + "\n" +
      "Price: GHS " + price.toFixed(2) + "\n" +
      "Appointment Date: " + formattedDate + "\n" +
      "Appointment Time: " + formattedTime + "\n\n" +
      "Please confirm if this appointment is available. Thank you!";

    const whatsappLink =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    // CREATE A DIRECT CLICKABLE WHATSAPP LINK

    if (bookingConfirmation) {
      bookingConfirmation.replaceChildren();

      bookingConfirmation.appendChild(
        document.createTextNode(
          "Your booking details are ready. Tap below to continue."
        )
      );

      const whatsappAnchor = document.createElement("a");

      whatsappAnchor.href = whatsappLink;
      whatsappAnchor.target = "_blank";
      whatsappAnchor.rel = "noopener noreferrer";
      whatsappAnchor.textContent = "Tap here to open WhatsApp";

      bookingConfirmation.appendChild(
        document.createElement("br")
      );

      bookingConfirmation.appendChild(whatsappAnchor);
      bookingConfirmation.classList.add("show");
      bookingConfirmation.classList.remove("error");
    } else {
      window.location.href = whatsappLink;
    }
  });
}
