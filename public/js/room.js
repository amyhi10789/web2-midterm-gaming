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
    room5: "5689"
};

fetch(`/progress/${username}`)
    .then(res => res.json())
    .then(data => {
        const progress = data.progress ?? data;

        if (progress[ROOM_NAME] === "locked") {
            alert("This room is locked. Complete previous rooms first.");
            location.href = "index.html";
            return;
        }

        if (progress[ROOM_NAME] === "completed") {
            const ending = document.getElementById("ending-text");
            if (ending) {
                ending.classList.remove("hidden");
            }

            completeBtn.classList.remove("hidden");
        }
    });


checkBtn.onclick = () => {
    const userAnswer = answerInput.value.trim();
    const correctAnswer = ANSWERS[ROOM_NAME];

    answerInput.classList.remove("flash-green", "flash-red");
    void answerInput.offsetWidth;

    if (userAnswer === correctAnswer) {
        answerInput.classList.add("flash-green");

        const ending = document.getElementById("ending-text");
        if (ending) {
            ending.classList.remove("hidden");
        }

        completeBtn.classList.remove("hidden");

        answerInput.disabled = true;
        checkBtn.disabled = true;
    } else {
        answerInput.classList.add("flash-red");
    }
};


completeBtn.onclick = async () => {
    await fetch(`/progress/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: ROOM_NAME })
    });

    location.href = "index.html";
};
