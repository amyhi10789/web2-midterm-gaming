const username = localStorage.getItem("username");
if (!username) location.href = "index.html";

document.getElementById("complete").onclick = async () => {
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
