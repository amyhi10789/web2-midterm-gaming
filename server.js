const express = require("express");
const fs = require("fs");
const path = require("path")

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.static("public"));

const USERS_FILE = path.join(__dirname, "data", "users.json");

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/login", (req, res) => {
    const { username, theme } = req.body;
    const users = loadUsers();

    if (!users[username]) {
        users[username] = {
            theme,
            progress: {
                room1: "unlocked",
                room2: "locked",
                room3: "locked",
                room4: "locked",
                room5: "locked",
                completed: false
            }
        };
        saveUsers(users);
    }

    res.json(users[username]);
});

app.get("/progress/:username", (req, res) => {
    const users = loadUsers();
    res.json(users[req.params.username]);
});

app.post("/progress", (req, res) => {
    const { username, room } = req.body;
    const users = loadUsers();

    users[username].progress[room] = "completed";

    const nextRoom = {
        room1: "room2",
        room2: "room3",
        room3: "room4",
        room4: "room5"
    }[room];

    if (nextRoom) {
        users[username].progress[nextRoom] = "unlocked";
    } else {
        users[username].progress.completed = true;
    }

    saveUsers(users);
    res.json(users[username].progress);
});

app.post("/reset", (req, res) => {
    const { username } = req.body;
    const users = loadUsers();
    delete users[username];
    saveUsers(users);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});