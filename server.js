const express = require("express");
const fs = require("fs");
const path = require("path")

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.static("public"));

const USERS_FILE = path.join(__dirname, "data", "users.json");
console.log("USERS_FILE PATH:", USERS_FILE);

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    const dir = path.dirname(USERS_FILE);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}


app.post("/login", (req, res) => {
    const { username, gender } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username required" });
    }

    const users = loadUsers();

    if (!users[username]) {
        users[username] = {
            gender,
            progress: {
                room1: "unlocked",
                room2: "locked",
                room3: "locked",
                room4: "locked",
                room5: "locked",
                completed: false
            }
        };
    }

    saveUsers(users);
    res.json(users[username]);
});

app.get("/progress/:username", (req, res) => {
    const users = loadUsers();
    const user = users[req.params.username];

    if (!user) {
        return res.json({
            progress: {
                room1: "unlocked",
                room2: "locked",
                room3: "locked",
                room4: "locked",
                room5: "locked",
                completed: false
            }
        });
    }

    res.json(user);
});


app.post("/progress", (req, res) => {
    const { username, room } = req.body;
    const users = loadUsers();

    if (!users[username]) {
        users[username] = {
            theme: "dark",
            progress: {
                room1: "unlocked",
                room2: "locked",
                room3: "locked",
                room4: "locked",
                room5: "locked",
                completed: false
            }
        };
    }

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

app.put("/progress/:username", (req, res) => {
    const { room } = req.body;
    const users = loadUsers();
    const user = users[req.params.username];

    if (!room) return res.status(400).json({ error: "Missing room" });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.progress[room]) return res.status(400).json({ error: "Invalid room name" });

    user.progress[room] = "completed";

    const nextRoom = {
        room1: "room2",
        room2: "room3",
        room3: "room4",
        room4: "room5",
    }[room];

    if (nextRoom) {
        user.progress[nextRoom] = "unlocked";
    } else {
        user.progress.completed = true;
    }

    saveUsers(users);
    res.json(user.progress);
});

app.delete("/users/:username", (req, res) => {
    const users = loadUsers();
    const username = req.params.username;

    if (!users[username]) {
        return res.status(404).json({ error: "User not found" });
    }

    delete users[username];
    saveUsers(users);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});