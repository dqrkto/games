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
