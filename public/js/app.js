const loginView = document.getElementById("login-view");
const homeView = document.getElementById("home-view");
const resetBtn = document.getElementById("reset");

const usernameInput = document.getElementById("username");
const genderSelect = document.getElementById("gender");
const startBtn = document.getElementById("start");

const username = localStorage.getItem("username");

if (username) {
    showHome();
} else {
    showLogin();
}

function getCookie(name) {
    const parts = document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="));
    return parts ? decodeURIComponent(parts.split("=")[1]) : null;
}

startBtn.onclick = async () => {
    const username = usernameInput.value.trim();
    const gender = genderSelect.value;

    if (!username) {
        alert("Please enter a username");
        return;
    }

    await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, gender })
    });

    localStorage.setItem("username", username);
    localStorage.setItem("gender", gender);
    document.cookie = `player=${encodeURIComponent(username)}; path=/`;

    showHome();
};

function showHome() {
    loginView.classList.add("hidden");
    homeView.classList.remove("hidden");

    const cookieName = getCookie("player");
    if (cookieName) {
        document.querySelector("#home-view h1").textContent =
            `Welcome, Detective ${cookieName} - Select Rooms`;
    }

    fetch(`/progress/${username}`)
        .then(res => res.json())
        .then(data => {
            const progress = data.progress ?? data;

            document.querySelectorAll(".rooms button").forEach(btn => {
                const room = btn.dataset.room;
                const status = progress[room];

                const isLocked = status === "locked";

                btn.classList.toggle("locked", isLocked);

                const lockIcon = btn.querySelector(".lock");
                if (lockIcon) {
                    lockIcon.style.display = isLocked ? "inline" : "none";
                }

                btn.onclick = () => {
                    if (isLocked) {
                        alert("This room is locked. Complete the previous room first.");
                        return;
                    }
                    location.href = `${room}.html`;
                };
            });

            if (progress.completed === true) {
                resetBtn.classList.remove("hidden");
            } else {
                resetBtn.classList.add("hidden");
            }
        });
}

function showLogin() {
    loginView.classList.remove("hidden");
    homeView.classList.add("hidden");
}

resetBtn.onclick = async () => {
    const username = localStorage.getItem("username");

    if (username) {
        await fetch(`/users/${username}`, {
            method: "DELETE"
        });
    }

    localStorage.clear();
    document.cookie = "player=; Max-Age=0; path=/";
    location.reload();
};
