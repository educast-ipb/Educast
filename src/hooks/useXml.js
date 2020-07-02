import { useState, useEffect, useCallback } from 'react';
import { xml2json, json2xml } from 'xml-js';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getXMLTimeStamp } from '../utils/formatting';

export function useXml(xml) {
	const scenes = useSelector((state) => state.sceneChapters.scenes);
	const duration = useSelector((state) => state.video.duration);

	console.log(scenes);

	// const [scenes, setScenes] = useState([]);
	const [chapters, setChapters] = useState([]);
	const [metadata, setMetadata] = useState([]);
	const [xmlTxt, setXmlTxt] = useState(xml);
	const [xmlJson, setXmlJson] = useState('');

	const getXMLScene = useCallback(
		(scene) => {
			const marker_in_seconds = scene.start.x * duration;
			const marker_out_seconds = scene.end.x * duration;

			return {
				marker_in: getXMLTimeStamp(marker_in_seconds * 1000),
				marker_out: getXMLTimeStamp(marker_out_seconds * 1000),
			};
		},
		[duration]
	);

	useEffect(() => {
		const xmlScenes = { scene: scenes.map(getXMLScene) };
		console.log(xmlScenes);
		setXmlJson((prev) => {
			if (!prev) return prev;
			prev['cutting_tool_data']['clip']['scenes'] = scenes;
			return { ...prev };
		});
	}, [getXMLScene, scenes]);

	useEffect(() => {
		setXmlJson((prev) => {
			if (!prev) return prev;
			prev['cutting_tool_data']['clip']['chapters'] = chapters;
			return { ...prev };
		});
	}, [chapters]);

	useEffect(() => {
		setXmlJson((prev) => {
			if (!prev) return prev;
			prev['cutting_tool_data']['clip']['metadata'] = metadata;
			return { ...prev };
		});
	}, [metadata]);

	useEffect(() => {
		if (!xmlTxt) return;
		setXmlJson(JSON.parse(xml2json(xmlTxt, { compact: true, spaces: 2 })));
	}, [xmlTxt]);

	const getCompleteXML = useCallback(() => {
		return json2xml(JSON.stringify(xmlJson), {
			compact: true,
			spaces: 2,
		});
	}, [xmlJson]);

	return {
		setChapters,
		setMetadata,
		setXmlTxt,
		getCompleteXML,
	};
}
