import { useState, useEffect } from 'react';

export function useXml() {
	const [scenes, setScenes] = useState([]);
	const [chapters, setChapters] = useState([]);
	const [metadata, setMetadata] = useState([]);
	const [xmlTxt, setXmlTxt] = useState('');
	const [xmlDoc, setXmlDoc] = useState('');

	useEffect(() => {
		if (!xmlDoc) return;
	}, [scenes]);

	useEffect(() => {
		if (!xmlDoc) return;
	}, [chapters]);

	useEffect(() => {
		if (!xmlDoc) return;
	}, [metadata]);

	useEffect(() => {
		if (!xmlTxt) return;
		const parser = new DOMParser();
		setXmlDoc(parser.parseFromString(xmlTxt, 'text/xml'));
	}, [xmlTxt]);

	return {
		setScenes,
		setChapters,
		setMetadata,
		setXmlTxt,
	};
}
