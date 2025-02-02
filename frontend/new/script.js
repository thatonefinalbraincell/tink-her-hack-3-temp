const apiUrl = "http://127.0.0.1:8000";  // Adjust the URL if needed

// Function to sign up a student
function addStudent() {
    const name = document.getElementById("name").value;
    const student_id = document.getElementById("student_id").value;
    const phone_number = document.getElementById("phone_number").value;

    if (!name || !student_id || !phone_number) {
        alert("Please fill all fields.");
        return;
    }

    const studentData = {
        name,
        student_id,
        phone_number
    };

    fetch(`${apiUrl}/add_student/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === "Student added successfully") {
            // Save user data to localStorage
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem('user', JSON.stringify(studentData));

            // Show user name in the top right corner
            updateUserTag();

            // Stay on the same page (no redirection)
            showPage('find');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    });
}

// Function to update the user tag in the top right corner
function updateUserTag() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById("user-tag").innerText = `Hello, ${user.name}`;
    }
}

// Automatically update the user tag if the user is already signed in
window.onload = function() {
    updateUserTag();
};

// Function to show the relevant page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const page = document.getElementById(pageId);
    page.classList.add('active');
}

// Function to find a ride
function findRide() {
    const pickup = document.getElementById("pickup").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;

    if (!pickup || !destination || !date) {
        alert("Please fill all fields.");
        return;
    }

    const rideData = {
        pickup,
        destination,
        date
    };

    fetch(`${apiUrl}/find_match/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rideData)
    })
    .then(response => response.json())
    .then(data => {
        const matchesContainer = document.getElementById("ride-matches");
        matchesContainer.innerHTML = "";
        if (data.length > 0) {
            data.forEach(ride => {
                const rideElement = document.createElement("div");
                rideElement.innerHTML = `<p>Pickup: ${ride.pickup}, Destination: ${ride.destination}, Date: ${ride.date}</p>`;
                matchesContainer.appendChild(rideElement);
            });
        } else {
            matchesContainer.innerHTML = "<p>No matching rides found.</p>";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while finding rides.");
    });
}

// Function to request a ride
function requestRide() {
    const student_id = document.getElementById("student_id").value;
    const pickup = document.getElementById("pickup").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;

    if (!student_id || !pickup || !destination || !date) {
        alert("Please fill all fields.");
        return;
    }

    const rideData = {
        pickup,
        destination,
        date
    };

    fetch(`${apiUrl}/add_ride/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rideData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === "Ride added successfully") {
            // Optionally clear the fields after submission
            document.getElementById("student_id").value = "";
            document.getElementById("pickup").value = "";
            document.getElementById("destination").value = "";
            document.getElementById("date").value = "";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while requesting the ride.");
    });
}

// Function to view student details
function viewStudent() {
    const student_id = document.getElementById("student_id").value;

    if (!student_id) {
        alert("Please enter a Student ID.");
        return;
    }

    fetch(`${apiUrl}/get_user/${student_id}`)
    .then(response => response.json())
    .then(data => {
        const studentDetailsContainer = document.getElementById("student-details");
        studentDetailsContainer.innerHTML = "";

        if (data.message) {
            studentDetailsContainer.innerHTML = `<p>${data.message}</p>`;
        } else {
            studentDetailsContainer.innerHTML = `
                <p>Name: ${data.name}</p>
                <p>Student ID: ${data.student_id}</p>
                <p>Phone Number: ${data.phone_number}</p>
            `;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while fetching student details.");
    });
}
// Function to find a ride
function findRide() {
    const pickup = document.getElementById("pickup").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;

    if (!pickup || !destination || !date) {
        alert("Please fill all fields.");
        return;
    }

    const rideData = {
        student_id,
        pickup,
        destination,
        date
    };

    fetch(`${apiUrl}/find_match/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rideData)
    })
    .then(response => response.json())
    .then(data => {
        const matchesContainer = document.getElementById("ride-matches");
        matchesContainer.innerHTML = "";
        if (data.length > 0) {
            data.forEach(ride => {
                const rideElement = document.createElement("div");
                rideElement.innerHTML = `<p>Pickup: ${ride.pickup}, Destination: ${ride.destination}, Date: ${ride.date}</p>`;
                matchesContainer.appendChild(rideElement);
            });
        } else {
            matchesContainer.innerHTML = "<p>No matching rides found.</p>";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while finding rides.");
    });
}

