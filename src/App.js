import React from 'react';
const MidiPlayer = require('midi-player-js');
const Soundfont = require('soundfont-player');

const ac = new AudioContext({
	latencyHint: 'playback',
	sampleRate: 48000
});

const Player = new MidiPlayer.Player();

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			audioContext: ac,
			instrument: '',
			Player: Player,
			currentEvent: {},
			notes: []
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

	processFile = async fileArrayBuffer => {
		const instrument = await Soundfont.instrument(
			ac,
			'acoustic_grand_piano'
		);
		this.setState({ instrument: instrument });

		const { Player } = this.state;

		Player.loadArrayBuffer(fileArrayBuffer);
		Player.fileLoaded();
		Player.on('midiEvent', event => this.playSound(event));
		Player.play();
	};

	playSound = event => {
		if (!event.noteNumber) return;

		this.setState({ currentEvent: event });

		console.log(event.noteNumber);
		this.state.instrument.play(event.noteNumber);
	};

	noteNumberToKeyboardKey = () => {
		// Midi noteNumber is an 7 bit field (0 - 127)
		// Keyboard Keys:
		// A - 65
		// S - 83
		// D - 68
		// F - 70
		// J - 74
		// K - 75
		// L - 76
		// ; - 59
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
