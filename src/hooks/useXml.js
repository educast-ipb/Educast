import { useState, useEffect, useCallback } from 'react';
import { xml2json, json2xml } from 'xml-js';

export function useXml() {
	const [scenes, setScenes] = useState([]);
	const [chapters, setChapters] = useState([]);
	const [metadata, setMetadata] = useState([]);
	const [xmlTxt, setXmlTxt] = useState('');
	const [xmlJson, setXmlJson] = useState('');

	useEffect(() => {
		setXmlJson((prev) => {
			if (!prev) return prev;
			prev['cutting_tool_data']['clip']['scenes'] = scenes;
			return { ...prev };
		});
	}, [scenes]);

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
		setScenes,
		setChapters,
		setMetadata,
		setXmlTxt,
		getCompleteXML,
	};
}
