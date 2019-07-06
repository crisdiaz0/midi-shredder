import React from 'react';
const MidiPlayer = require('midi-player-js');

const getFile = e => {
	const file = e.target.files[0];

	if (file.type !== 'audio/midi') return;

	const fileReader = new FileReader();
	fileReader.readAsArrayBuffer(file);

	fileReader.onload = () => {
		processFile(fileReader.result);
	};
};

const processFile = fileArrayBuffer => {
	// only console logging the events for now
	const Player = new MidiPlayer.Player(e => {
		console.log(e);
	});

	Player.loadArrayBuffer(fileArrayBuffer);
	Player.dryRun();
	Player.play();
};

function App() {
	return (
		<div className="App">
			<h1>midi-shredder</h1>
			<input
				type="file"
				id="files"
				name="files"
				onInput={e => getFile(e)}
			/>
		</div>
	);
}

export default App;
