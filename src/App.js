import React from 'react';
import { parseArrayBuffer } from 'midi-json-parser';

const getFile = e => {
	const file = e.target.files[0];

	if (file.type !== 'audio/midi') return;

	const fileReader = new FileReader();
	fileReader.readAsArrayBuffer(file);

	fileReader.onload = function() {
		processFile(fileReader.result);
	};
};

const processFile = fileArrayBuffer => {
	parseArrayBuffer(fileArrayBuffer).then(json => {
		console.log(json);
	});
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
