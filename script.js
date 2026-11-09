```javascript
// SUPABASE CONNECTION
const SUPABASE_URL = "https://amwrfbuclxghuzmsktvy.supabase.co";
const SUPABASE_KEY = "sb_publishable_wFMy2zCyeA_X9b96u1doeQ_wu1Y_vtx";

const BOOKINGS_URL = `${SUPABASE_URL}/rest/v1/bookings`;

// MOBILE MENU
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

// AUTOMATIC FOOTER YEAR
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// BOOKING FORM
const bookingForm = document.getElementById("bookingForm");
const customerName = document.getElementById("customerName");
const serviceSelect = document.getElementById("serviceSelect");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");
const whatsappButton = document.getElementById("whatsappButton");
const bookingSummary = document.getElementById("bookingSummary");
const bookingConfirmation = document.getElementById("bookingConfirmation");

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

// SET MINIMUM BOOKING DATE TO TODAY
if (appointmentDate) {
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  appointmentDate.min = localToday;
}

// DISPLAY BOOKING SUMMARY
function updateBookingSummary() {
  if (!bookingSummary || !serviceSelect) return;

  const selectedService = serviceSelect.value;
  const price = servicePrices[selectedService];

  if (selectedService && price !== undefined) {
    bookingSummary.textContent =
      `Selected service: ${selectedService} — GHS ${price.toFixed(2)}`;
  } else {
    bookingSummary.textContent = "";
  }
}

if (serviceSelect) {
  serviceSelect.addEventListener("change", updateBookingSummary);
}

// SHOW BOOKING MESSAGE
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

// SUBMIT BOOKING
if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = customerName.value.trim();
    const service = serviceSelect.value;
    const date = appointmentDate.value;
    const time = appointmentTime.value;
    const price = servicePrices[service];

    if (!name || !service || !date || !time) {
      showBookingMessage("Please complete all booking details.", true);
      return;
    }

    if (price === undefined) {
      showBookingMessage("Please select a valid service.", true);
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showBookingMessage("Please select today or a future date.", true);
      return;
    }

    const submitButton = bookingForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    if (bookingConfirmation) {
      bookingConfirmation.classList.remove("show", "error");
    }

    try {
      const response = await fetch(BOOKINGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          customer_name: name,
          service: service,
          price: price,
          appointment_date: date,
          appointment_time: time,
          status: "Pending"
        })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Booking error:", errorDetails);
        throw new Error("Your booking could not be saved.");
      }

      showBookingMessage(
        "Your booking details have been saved successfully!"
      );

      // OPEN WHATSAPP AFTER THE BOOKING IS SAVED
      const message =
        `Hello Yvonne! I would like to book an appointment.\n\n` +
        `Name: ${name}\n` +
        `Service: ${service}\n` +
        `Price: GHS ${price.toFixed(2)}\n` +
        `Date: ${date}\n` +
        `Time: ${time}\n\n` +
        `Please confirm my appointment.`;

      const whatsappURL =
        `https://wa.me/233241415612?text=${encodeURIComponent(message)}`;

      if (whatsappButton) {
        whatsappButton.href = whatsappURL;
        whatsappButton.target = "_blank";
        whatsappButton.rel = "noopener noreferrer";
        whatsappButton.textContent = "Continue to WhatsApp";
        whatsappButton.style.display = "block";
      }

      window.open(whatsappURL, "_blank");

      bookingForm.reset();
      updateBookingSummary();

    } catch (error) {
      console.error(error);

      showBookingMessage(
        "Sorry, your booking could not be saved. Please try again or contact us on WhatsApp.",
        true
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Book Appointment";
      }
    }
  });
}
```
