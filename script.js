// FOOTER YEAR
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// MOBILE NAVIGATION
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {
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
      if (window.innerWidth <= 800) {
        nav.style.display = "none";
      }
    });
  });
}

// SUPABASE CONNECTION
const SUPABASE_URL =
  "https://amwrfbuclxghuzmsktvy.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_wFMy2zCyeA_X9b96u1doeQ_wu1Y_vtx";

const SUPABASE_REST_URL =
  SUPABASE_URL + "/rest/v1";

// BOOKING FORM
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

// PREVENT PAST APPOINTMENT DATES
if (appointmentDate) {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  appointmentDate.min = localDate;
}

// DISPLAY SELECTED SERVICE PRICE
function updateBookingSummary() {
  const selectedService = serviceSelect.value;

  if (selectedService && servicePrices[selectedService] !== undefined) {
    bookingSummary.textContent =
      "Selected service: " + selectedService +
      " — GHS " + servicePrices[selectedService].toFixed(2);
  } else {
    bookingSummary.textContent = "";
  }
}

if (serviceSelect) {
  serviceSelect.addEventListener("change", updateBookingSummary);
}

// SHOW BOOKING MESSAGES
function showBookingMessage(message, isError = false) {
  bookingConfirmation.textContent = message;
  bookingConfirmation.className = "booking-confirmation show";

  if (isError) {
    bookingConfirmation.classList.add("error");
  }
}

// SUBMIT BOOKING
if (whatsappButton) {
  whatsappButton.addEventListener("click", async () => {
    const name = customerName.value.trim();
    const service = serviceSelect.value;
    const date = appointmentDate.value;
    const time = appointmentTime.value;

    bookingConfirmation.className = "booking-confirmation";
    bookingConfirmation.textContent = "";

    // CHECK REQUIRED FIELDS
    if (!name || !service || !date || !time) {
      showBookingMessage(
        "Please complete all booking details before submitting.",
        true
      );
      return;
    }

    // CHECK SERVICE
    if (servicePrices[service] === undefined) {
      showBookingMessage("Please select a valid service.", true);
      return;
    }

    // CHECK DATE
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (date < localDate) {
      showBookingMessage(
        "Please choose today or a future appointment date.",
        true
      );
      return;
    }

    const price = servicePrices[service];

    // BOOKING DETAILS
    const bookingDetails = {
      customer_name: name,
      service: service,
      price: price,
      appointment_date: date,
      appointment_time: time,
      status: "Pending"
    };

    // OPEN A TAB FOR WHATSAPP
    const whatsappWindow = window.open("about:blank", "_blank");

    whatsappButton.disabled = true;
    whatsappButton.textContent = "Submitting booking...";

    try {
      // SAVE BOOKING TO SUPABASE
      const response = await fetch(
        SUPABASE_REST_URL + "/bookings",
        {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify(bookingDetails)
        }
      );

      if (!response.ok) {
        throw new Error("Booking could not be saved.");
      }

      // CREATE WHATSAPP MESSAGE
      const message =
        "Hello Yvone! I would like to book a lash appointment.\n\n" +
        "Name: " + name + "\n" +
        "Service: " + service + "\n" +
        "Price: GHS " + price.toFixed(2) + "\n" +
        "Date: " + date + "\n" +
        "Time: " + time + "\n\n" +
        "Please confirm my appointment. Thank you!";

      const whatsappLink =
        "https://wa.me/233241415612?text=" +
        encodeURIComponent(message);

      showBookingMessage(
        "Your booking request has been saved successfully! Please send your WhatsApp message to Yvone to confirm your appointment."
      );

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappLink;
      } else {
        window.location.href = whatsappLink;
      }

    } catch (error) {
      if (whatsappWindow) {
        whatsappWindow.close();
      }

      showBookingMessage(
        "Sorry, we could not save your booking. Please try again or contact Yvone directly.",
        true
      );

      console.error("Booking error:", error);

    } finally {
      whatsappButton.disabled = false;
      whatsappButton.textContent = "Submit Booking";
    }
  });
}
