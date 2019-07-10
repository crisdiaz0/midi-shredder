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
			tracks: [],
			lowestNote: 0,
			highestNote: 0
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
		this.processAllNotes();
		this.createTracks();
		// Player.play();
	};

	processAllNotes = () => {
		const { Player } = this.state;
		const allEvents = Player.getEvents()[0];

		const min = allEvents.reduce(
			(min, noteObj) =>
				noteObj.noteNumber < min ? noteObj.noteNumber : min,
			128
		);

		const max = allEvents.reduce(
			(max, noteObj) =>
				noteObj.noteNumber > max ? noteObj.noteNumber : max,
			0
		);

		this.setState({
			lowestNote: min,
			highestNote: max
		});
	};

	playSound = event => {
		if (!event.noteNumber) return;

		this.setState({ currentEvent: event });

		this.state.instrument.play(event.noteNumber);
	};

	createTracks = () => {
		const tracks = {
			0: [],
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
			7: []
		};

		const totalRange = this.state.highestNote - this.state.lowestNote;
		console.log('totalRange: ', totalRange);
		const trackRange = Math.ceil(totalRange / 8);
		console.log('trackRange: ', trackRange);
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
		// { hasNote: 1, noteNumber: 20 }
		// { hasNote: 0 }
		const numToKey = {};
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
