import React from 'react';
import Loadable from 'react-loadable';

class AsyncChunks {
	chunksQueue = [];

	appendToQueue = chunk => this.chunksQueue.push(chunk)

	generateChunk = (loader) => {
		this.appendToQueue(loader);
		return Loadable({ 
			loader, 
			loading: () => <div></div>
		});
	}

	loadChunks = () => {
		this.chunksQueue.forEach(loader => loader());
		this.chunksQueue = [];
	}
}

export default new AsyncChunks();
