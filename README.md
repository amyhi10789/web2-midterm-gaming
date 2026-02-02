Can you complete the puzzles and solve the case?

Link to deployed page: https://web2-midterm-gaming.onrender.com/

Reflection questions:
1. I chose the escape room option, but put my own twist on it by changing it to a multi-room murder mystery puzzle game. I was feeling insprired since the day I started the MA I had just finished watching a murder mystery romance kdrama, so I guess you could credit that drama for this midterm project idea.
2. I built custom API endpoints with Express. Eg. the /login endpoint creates or retrieves a user's data from the data file users.json. The /progress/:username GET endpoint gets the user's current progress from that data file so it can be displayed in a table. I also made PUT and POST endpoints to update room completion and unlock the next room. I also put a DELETE endpoint to reset a user's progress.
3. I used URL parameters in Room 3, where there's an option for a hard mode (where there are no hints) as for cookies, I used it to store the currently logged-in player's username, allowing the homepage to display a personalized greeting.
4. I added the visual animation of a red or green glow/flash around the input box when a user submits a correct or incorrect answer to the puzzles.
5. I challenged myself by putting extra effort into the styling of the page, the creation of the puzzles (which I made all myself), and figuring out how to make those custom endpoints. I also learned a lot about servers/APIs in the process.
