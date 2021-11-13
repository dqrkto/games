var newGames = [];

gamesJSON.forEach((platform) => {
	if (platform.platform != 'Wishes') {
		platform.games.forEach((game) => {
			newGames.push({ ...game, ...{ platform: platform.platform } });
		});
	}
});

gamesJSON.push({ platform: 'All', games: newGames });

gamesJSON.sort((a, b) => (a.platform > b.platform ? 1 : -1));

gamesJSON.forEach((platform) => {
	platform.games.sort((a, b) => (a.name > b.name ? 1 : -1));
});

const templateBox = Handlebars.compile(
	document.getElementById('boxAll').innerHTML
);

document.getElementById('boxAll').innerHTML = templateBox({
	gamesJSON: gamesJSON,
});

function searchGame(textSearch) {
	var contentUlSearch = '',
		ulSearch = document.getElementById('ulSearch')

	if (textSearch.length >= 3) {
		for(gameOne of newGames){
			if(gameOne.name.toUpperCase().indexOf(textSearch.toUpperCase()) > -1){
				contentUlSearch += '<li><div class="row justify-content-center align-items-center w-100 m-0"><div class="col-3 col-lg-4 border-end border-secondary text-dark small">'
				contentUlSearch += gameOne.platform
				contentUlSearch += '</div><div class="col-9 col-lg-8 border-start border-secondary">'
				contentUlSearch += gameOne.name
				contentUlSearch += '</div></div></li>'
			}
		}
		
		ulSearch.innerHTML = contentUlSearch
		ulSearch.classList.remove('d-none')
	}

	else{
		ulSearch.classList.add('d-none')
	}

}

/*

2.5		|
2.5		|	5

2.5		|
10		|
5		|	30
10		|
2.5		|

2.5		|
10		|
5		|	30
10		|
2.5		|

2.5		|
10		|
5		|	30
10		|
2.5		|

2.5		|	5
2.5		|

*/
