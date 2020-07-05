import { createStore, combineReducers } from 'redux';
import { videoReducer } from './videoReducer';
import { timelineReducer } from './timelineReducer';
import { sceneAndChaptersReducer } from './scenesAndChaptersReducer';
import { metadataReducer } from './metadataReducer';

export const store = createStore(
	combineReducers({
		video: videoReducer,
		timeline: timelineReducer,
		sceneChapters: sceneAndChaptersReducer,
		metadata: metadataReducer,
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
