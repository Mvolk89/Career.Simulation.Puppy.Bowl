const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

const cohortName = "2311-FTB-MT-WEB-PT";

const BASEAPIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
	try {
		const response = await fetch(`${BASEAPIURL}players/`);
		const players = await response.json();
		return players.data.players;
	} catch (err) {
		console.error("Trouble fetching players", err);
	}
};

const fetchSinglePlayer = async playerId => {
	try {
		const response = await fetch(`${BASEAPIURL}players/${playerId}`);
		const player = await response.json();
		return player;
	} catch (err) {
		console.error(`Trouble fetching player #${playerId}!`, err);
	}
};

const addNewPlayer = async playerObj => {
    try {
        const response = await fetch(`${BASEAPIURL}players/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(playerObj),
        });
	} catch (err) {
		console.error("Something went wrong with adding that player", err);
	}
};

const deletePlayer = async playerId => {
	try {
		await fetch(`${BASEAPIURL}players/${playerId}`, {
			method: "DELETE",
		});
		console.log(`Player #${playerId} deleted.`);
	} catch (err) {
		console.error(`Trouble deleting player #${playerId}!`, err);
	}
};

const renderAllPlayers = playerList => {
	try {
		const playerContainerHTML = playerList
			.map(
				player => `
            <div class="player-card" data-player-id="${player.id}">
                <h3>${player.name}</h3>
                <button class="details-button">See details</button>
                <button class="remove-button">Remove from roster</button>
                <div class="player-details" id="player-details-${player.id}" style="display: none;">
                </div>
            </div>
        `
			)
			.join("");
		playerContainer.innerHTML = playerContainerHTML;

		playerContainer.addEventListener("click", async event => {
			const playerId = event.target.closest(".player-card").dataset.playerId;

			if (event.target.classList.contains("details-button")) {
				viewDetails(playerId, playerList);
			} else if (event.target.classList.contains("remove-button")) {
				await deletePlayer(playerId);
				window.location.reload();
			}
		});
	} catch (err) {
		console.error("Trouble rendering players", err);
	}
};

const viewDetails = async (playerId, playerList) => {
    try {
        const playerDetailsContainer = document.getElementById(`player-details-${playerId}`);
        const player = playerList.find(player => player.id == playerId);

        if (!player) {
            console.error(`Player with ID ${playerId} not found.`);
            return;
        }

        console.log("Player Details:", player);

        playerDetailsContainer.innerHTML = `
            <p>Name: ${player.name}</p>
            <p>ID: ${player.id}</p>
            <p>Breed: ${player.breed}</p>
            <p>Status: ${player.status}</p>
            <img src="${player.imageUrl}" alt="${player.name} Image" style="max-width: 100%; height: auto;">
        `;
        playerDetailsContainer.style.display = "block";
    } catch (err) {
        console.error(`Trouble fetching details for player #${playerId}`, err);
    }
};

const renderNewPlayerForm = () => {
	try {
		newPlayerFormContainer.innerHTML = `
            <form id="new-player-form">
                <label for="puppyID">Puppy ID:</label>
                <input type="number" id="puppyID" required>
                <label for="puppyName">Puppy Name:</label>
                <input type="text" id="puppyName" required>
                <label for="puppyBreed">Puppy Breed:</label>
                <input type="text" id="puppyBreed" required>
                <label for="puppyStatus">Puppy Status:</label>
                <input type="text" id="puppyStatus" required>
                <label for="puppyImage">Puppy Image:</label>
                <input type="text" id="puppyImage" required>
                <button type="submit" id='puppyForm'>Add to Puppy Bowl</button>
            </form>
        `;

		document
			.getElementById("new-player-form")
			.addEventListener("submit", async event => {
				console.log("submitting form");
				event.preventDefault();
				const puppyID = document.getElementById("puppyID").value;
				const puppyName = document.getElementById("puppyName").value;
				const puppyBreed = document.getElementById("puppyBreed").value;
				const puppyStatus = document.getElementById("puppyStatus").value;
				const puppyImage = document.getElementById("puppyImage").value;
				console.log(puppyName);
				await addNewPlayer({
					name: puppyName,
					id: puppyID,
					breed: puppyBreed,
					status: puppyStatus,
					image: puppyImage,
				});
				const updatedPlayers = await fetchAllPlayers();
				renderAllPlayers(updatedPlayers);

				document.getElementById("puppyName").value = "";
				document.getElementById("puppyID").value = "";
				document.getElementById("puppyBreed").value = "";
				document.getElementById("puppyStatus").value = "";
				document.getElementById("puppyImage").value = "";
			});
	} catch (err) {
		console.error("Trouble rendering the new player form", err);
	}
};

const init = async () => {
	const players = await fetchAllPlayers();
	console.log(players);
	renderAllPlayers(players);

	renderNewPlayerForm();
};

init();
