const loginView = document.getElementById("login-view");
const homeView = document.getElementById("home-view");
const resetBtn = document.getElementById("reset");

const usernameInput = document.getElementById("username");
const themeSelect = document.getElementById("theme");
const startBtn = document.getElementById("start");

const username = localStorage.getItem("username");

if (username) {
    showHome();
} else {
    showLogin();
}

startBtn.onclick = async () => {
    const username = usernameInput.value.trim();
    const theme = themeSelect.value;

    if (!username) {
        alert("Please enter a username");
        return;
    }

    await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, theme })
    });

    localStorage.setItem("username", username);
    localStorage.setItem("theme", theme);

    showHome();
};

function showHome() {
    loginView.classList.add("hidden");
    homeView.classList.remove("hidden");

    document.querySelectorAll(".rooms button").forEach(btn => {
        const room = btn.dataset.room;

        let isLocked = false;

        if (room !== "room1") {
            isLocked = localStorage.getItem(`${room}_unlocked`) !== "true";
        }

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

        if (localStorage.getItem("game_completed") === "true") {
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

    await fetch("/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });

    localStorage.clear();
    showLogin();
};

