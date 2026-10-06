let allGames = [];

document.addEventListener('DOMContentLoaded', () => {
	initApp();
});

function initApp() {
	// Garante que todos os itens possuam as propriedades padrão e ordena por nome
	allGames = gamesJSON.map(g => ({
		name: g.name || "",
		platform: g.platform || "Outros",
		score: g.score !== undefined ? g.score : null,
		status: g.status || "not_played",
		cover: g.cover || "",
		genres: Array.isArray(g.genres) ? g.genres : [],
		release_year: g.release_year || null,
		timeMain: (g.timeMain || "-") + (g.timeMain ? "h" : ""),
		timeMainExtra: (g.timeMainExtra || "-") + (g.timeMainExtra ? "h" : "")
	})).sort((a, b) => a.name.localeCompare(b.name));

	populateDropdowns();
	applyFilters();
}

function populateDropdowns() {
	const platformSelect = document.getElementById('filterPlatform');
	const genreSelect = document.getElementById('filterGenre');

	// Extrai plataformas únicas
	const platforms = new Set(allGames.map(g => g.platform));
	Array.from(platforms).sort().forEach(plat => {
		platformSelect.innerHTML += `<option value="${plat}">${plat}</option>`;
	});

	// Extrai gêneros únicos
	const allGenres = new Set();
	allGames.forEach(game => {
		game.genres.forEach(gen => allGenres.add(gen));
	});
	Array.from(allGenres).sort().forEach(gen => {
		genreSelect.innerHTML += `<option value="${gen}">${gen}</option>`;
	});
}

function getScoreBadgeHtml(score) {
	if (score === null || score === undefined) {
		return `<span class="score-badge score-nop">-</span>`;
	}
	const num = parseFloat(score);
	if (num >= 9) return `<span class="score-badge score-high">${num}</span>`;
	if (num >= 6) return `<span class="score-badge score-mid">${num}</span>`;
	return `<span class="score-badge score-low">${num}</span>`;
}

function applyFilters() {
	const searchTerm = document.getElementById('searchInput').value.toLowerCase();
	const platformFilter = document.getElementById('filterPlatform').value;
	const statusFilter = document.getElementById('filterStatus').value;
	const genreFilter = document.getElementById('filterGenre').value;

	const filtered = allGames.filter(game => {
		const matchesSearch = game.name.toLowerCase().includes(searchTerm);
		const matchesPlatform = (platformFilter === 'all') || (game.platform === platformFilter);
		const matchesStatus = (statusFilter === 'all') || (game.status === statusFilter);
		const matchesGenre = (genreFilter === 'all') || game.genres.includes(genreFilter);

		return matchesSearch && matchesPlatform && matchesStatus && matchesGenre;
	});

	renderGrid(filtered);
}

function renderGrid(games) {
	const grid = document.getElementById('gamesGrid');
	const counter = document.getElementById('counterInfo');
	
	counter.innerText = `Exibindo ${games.length} de ${allGames.length} jogos`;
	grid.innerHTML = '';

	if (games.length === 0) {
		grid.innerHTML = `
			<div class="col-12 text-center py-5 text-white-50">
				<p class="fs-5">Nenhum jogo encontrado com os filtros atuais.</p>
			</div>
		`;
		return;
	}

	games.forEach(game => {
		const yearText = game.release_year ? `<span class="text-white-50 small ms-1">(${game.release_year})</span>` : '';
		
		const genresHtml = game.genres.length > 0 
			? game.genres.map(g => `<span class="badge bg-secondary opacity-50 me-1" style="font-size: 0.65rem;">${g}</span>`).join('') 
			: '<span class="text-white-50 small">Sem gênero</span>';

		grid.innerHTML += `
			<div class="col-12 col-sm-6 col-md-4 col-lg-3">
				<div class="game-card p-3">
					<div>
						<div class="d-flex justify-content-between align-items-start mb-2">
							<span class="badge platform-badge rounded-pill">${game.platform}</span>
							<div class="d-flex justify-content-between ">
								<div class="game-info me-2">
									<span class="time-badge" title="Time">
										🎮 ${game.timeMain} ➕ ${game.timeMainExtra}
									</span>
								</div>
								${getScoreBadgeHtml(game.score)}
							</div>
						</div>
						<h6 class="fw-bold mb-1 text-white">${game.name} ${yearText}</h6>
					</div>
					<div class="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
						<div class="text-truncate" style="max-width: 65%;">${genresHtml}</div>
						<span class="status-badge status-${game.status}">${game.status.replace('_', ' ')}</span>
					</div>
				</div>
			</div>
		`;
	});
}

async function generateJSON() {
	const platform = document.getElementById('addPlatform').value;
	const name = document.getElementById('addName').value;
	const scoreVal = document.getElementById('addScore').value;
	const status = document.getElementById('addStatus').value;
	const genresVal = document.getElementById('addGenres').value;
	const yearVal = document.getElementById('addYear').value;
	const timeMain = document.getElementById('addTimeMain').value;
	const timeMainExtra = document.getElementById('addTimeMainExtra').value;

	if (!name || !platform) return;

	const genresArray = genresVal ? genresVal.split(',').map(g => g.trim()).filter(g => g.length > 0) : [];

	let obj = {
		name: name,
		platform: platform,
		score: scoreVal !== "" ? parseFloat(scoreVal) : null,
		status: status,
		cover: "",
		genres: genresArray,
		release_year: yearVal !== "" ? parseInt(yearVal) : null,
		timeMain: timeMain,
		timeMainExtra: timeMainExtra
	};

	textToCopy = JSON.stringify(obj, null, 4) + `,`

	await navigator.clipboard.writeText(textToCopy);

	document.getElementById('jsonOutput').value = textToCopy;
	document.getElementById('jsonOutputContainer').classList.remove('d-none');
}