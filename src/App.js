import React from 'react';
const MidiPlayer = require('midi-player-js');
const Soundfont = require('soundfont-player');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentEvent: {}
		};
	}

	getFile = e => {
		const file = e.target.files[0];

		if (file.type !== 'audio/midi') return;

		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);

		fileReader.onload = () => {
			this.processFile(fileReader.result);
		};
	};

	processFile = fileArrayBuffer => {
		Soundfont.instrument(new AudioContext(), 'electric_guitar_muted').then(
			instrument => {
				const Player = new MidiPlayer.Player(e => {
					this.setState({ currentEvent: e });
					instrument.play(e.noteNumber);
				});

				Player.loadArrayBuffer(fileArrayBuffer);
				Player.fileLoaded();
				Player.play();
			}
		);
	};

	render() {
		return (
			<div className="App">
				<h1>midi-shredder</h1>
				<input
					type="file"
					id="files"
					name="files"
					onInput={e => this.getFile(e)}
				/>

				<h2>{this.state.currentEvent.noteName}</h2>
			</div>
		);
	}
}

export default App;
