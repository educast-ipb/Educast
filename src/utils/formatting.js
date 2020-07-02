// Always returns two digit number to match time format.
const pad = (number) => {
	return ('0' + number).slice(-2);
};

const padMs = (number) => {
	return ('00' + number).slice(-3);
};

// Helper for formatting time label (returns 'hh:mm:ss' given chapter position in range [0..1] and full video length in seconds).
// Inputs: chapterPosition: chapter position in range [0..1]
//				 fullVideoLength: full video length in seconds
// Output: 'hh:mm:ss' time format.
export const timeFormatter = (chapterPosition, fullVideoLength) => {
	let chapterPositionInSeconds = Math.floor(chapterPosition * fullVideoLength);
	let inMinutes = Math.floor(chapterPositionInSeconds / 60);
	chapterPositionInSeconds = chapterPositionInSeconds % 60;
	let inHours = Math.floor(inMinutes / 60);
	inMinutes = inMinutes % 60;
	return `${pad(inHours)}:${pad(inMinutes)}:${pad(chapterPositionInSeconds)}`;
};

export const getXMLTimeStamp = (timeInMS) => {
	const ms = timeInMS % 1000;
	let seconds = Math.floor(timeInMS / 1000);
	let minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;
	let hours = Math.floor(minutes / 60);
	minutes = minutes % 60;
	let days = Math.floor(hours / 24);
	hours = hours % 24;
	return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${padMs(ms)}`;
};
