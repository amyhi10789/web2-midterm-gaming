const username = localStorage.getItem("username");
if (!username) location.href = "index.html";

const answerInput = document.querySelector(".answer-input");
const checkBtn = document.getElementById("check_answer");
const completeBtn = document.getElementById("complete");

const ANSWERS = {
    room1: "i am closer than you think",
    room2: "1134000000",
    room3: "up right up right up left up right up left up left down left up left up right up right up right up left up left up right up left up",
    room4: "if i am ever dead it was stacy and wilson",
    room5: "placeholder"
};

if (localStorage.getItem(`${ROOM_NAME}_solved`) === "true") {
    completeBtn.classList.remove("hidden");
}

checkBtn.onclick = () => {
    const userAnswer = answerInput.value.trim();
    const correctAnswer = ANSWERS[ROOM_NAME];

    answerInput.classList.remove("flash-green", "flash-red");
    void answerInput.offsetWidth;

    if (userAnswer === correctAnswer) {
        answerInput.classList.add("flash-green");
        localStorage.setItem(`${ROOM_NAME}_solved`, "true");
        completeBtn.classList.remove("hidden");
    } else {
        answerInput.classList.add("flash-red");
    }
};

completeBtn.onclick = async () => {
    localStorage.setItem(`${ROOM_NAME}_completed`, "true");

    const nextRoom = {
        room1: "room2",
        room2: "room3",
        room3: "room4",
        room4: "room5"
    }[ROOM_NAME];

    if (nextRoom) {
        localStorage.setItem(`${nextRoom}_unlocked`, "true");
    } else {
        localStorage.setItem("game_completed", "true");
    }

    fetch("/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, room: ROOM_NAME })
    }).catch(() => { });

    location.href = "index.html";
};
