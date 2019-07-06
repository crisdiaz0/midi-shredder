import React from 'react';
import { parseArrayBuffer } from 'midi-json-parser';

const getFile = e => {
	const file = e.target.files[0];
	console.log('file: ', file);

	if (file.type !== 'audio/midi') return;

	const fileReader = new FileReader();
	fileReader.readAsArrayBuffer(file);
	console.log('fileReader: ', fileReader);
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
