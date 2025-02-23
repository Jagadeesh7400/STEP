document.addEventListener("DOMContentLoaded", function () {
    const numDays = document.getElementById("numDays");
    const eventDate = document.getElementById("eventDate");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const venueList = document.getElementById("venueList");
    const venueSection = document.getElementById("venueSection");
    const eventDetails = document.getElementById("eventDetails");
    const bookingForm = document.getElementById("bookingForm");

    numDays.addEventListener("change", function () {
        if (numDays.value === "multiple") {
            document.getElementById("multiDayFields").style.display = "block";
            eventDate.required = false;
            startDate.required = true;
            endDate.required = true;
        } else {
            document.getElementById("multiDayFields").style.display = "none";
            eventDate.required = true;
            startDate.required = false;
            endDate.required = false;
        }
    });

    document.getElementById("checkAvailability").addEventListener("click", function () {
        let params = new URLSearchParams({
            start_date: numDays.value === "multiple" ? startDate.value : eventDate.value,
            end_date: numDays.value === "multiple" ? endDate.value : eventDate.value,
            start_time: document.getElementById("startTime").value,
            end_time: document.getElementById("endTime").value
        });

        fetch(`/check-availability/?${params}`)
            .then(response => response.json())
            .then(data => {
                venueList.innerHTML = "";
                if (data.venues.length > 0) {
                    data.venues.forEach(venue => {
                        let btn = document.createElement("button");
                        btn.textContent = venue.name;
                        btn.classList.add("venue-btn");
                        btn.dataset.venueId = venue.id;
                        btn.addEventListener("click", function () {
                            document.getElementById("selectedVenue").value = venue.name;
                            venueSection.style.display = "none";
                            eventDetails.style.display = "block";
                        });
                        venueList.appendChild(btn);
                    });
                } else {
                    venueList.innerHTML = "<p>No venues available</p>";
                }
                venueSection.style.display = "block";
            });
    });

    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        fetch("/submit-booking/", {
            method: "POST",
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Booking successful!");
                    location.reload();
                } else {
                    alert("Error: " + JSON.stringify(data.error));
                }
            });
    });

    document.getElementById("back-button").addEventListener("click", function(){
        venueSection.style.display = "none";
        eventDetails.style.display = "none";
    })
});







