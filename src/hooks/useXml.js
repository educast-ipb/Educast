import { useState, useEffect, useCallback } from 'react';
import { xml2json, json2xml } from 'xml-js';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getXMLTimeStamp } from '../utils/formatting';

export function useXml(xml) {
	const scenes = useSelector((state) => state.sceneChapters.scenes);
	const chapters = useSelector((state) => state.sceneChapters.chapters);
	const duration = useSelector((state) => state.video.duration);

	// const [scenes, setScenes] = useState([]);
	// const [chapters, setChapters] = useState([]);
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

	const getXMLChapters = useCallback(
		(chapter) => {
			const marker_in_seconds = chapter.position * duration;

			return {
				marker_in: getXMLTimeStamp(marker_in_seconds * 1000),
				title: chapter.title || '',
				marker_thumbnail: getXMLTimeStamp(marker_in_seconds * 1000),
				thumbnail_url: {
					_attributes: {
						read_only: true,
					},
					_text:
						'https://educast.fccn.pt/img/clips/2jcdfpptkn/tmp/chapters/0000102667',
				},
			};
		},
		[duration]
	);

	useEffect(() => {
		const xmlScenes = { scene: scenes.map(getXMLScene) };
		setXmlJson((prev) => {
			if (!prev) return prev;
			prev['cutting_tool_data']['clip']['scenes'] = xmlScenes;
			return { ...prev };
		});
	}, [getXMLScene, scenes]);

	useEffect(() => {
		const xmlChapters = {
			_attributes: {
				property_update_marker_thumbnail:
					'https://educast.fccn.pt/clips/34114/cutting_tool_data/chapter_thumbnail.js?locale=en',
				property_validation_title: '/^.{0,50}$/',
			},
			chapter: chapters.map(getXMLChapters),
		};

		setXmlJson((prev) => {
			if (!prev) return prev;
			prev['cutting_tool_data']['clip']['chapters'] = xmlChapters;
			return { ...prev };
		});
	}, [chapters, getXMLChapters]);

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
		setMetadata,
		setXmlTxt,
		getCompleteXML,
	};
}
