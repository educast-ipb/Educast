const initialState = {
	title: '',
	subtitle: '',
	date: '',
	local: '',
	description: '',
	tag: [],
};

export const metadataReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_METADATA':
			return Object.assign({}, state, {
				[action.name]: action.value,
			});
		default:
			return state;
	}
};
