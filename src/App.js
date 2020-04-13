import React, {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import './App.scss';

import VideoContainer from './components/VideoPlayer/VideoContainer';
import Tabs from './components/Tabs';
import { BrowserRouter } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import StepperComponent from './components/Stepper';
import { FaSave, FaShare } from 'react-icons/fa';

import useModal from './hooks/useModal';

import SaveModal from './components/SaveModal';
import PublishModal from './components/PublishModal';
import { useXml } from './hooks/useXml';
const { xml } = require('./resources/base.xml.js');

function App() {
	const [step, setStep] = useState(0);
	const videoComponentRef = useRef(null);
	const {
		setScenes,
		setChapters,
		setMetadata,
		setXmlTxt,
		getCompleteXML,
	} = useXml();

	const { isOpen: isSaveModalOpen, onToggle: onToggleSaveModal } = useModal();
	const {
		isOpen: isPublishModalOpen,
		onToggle: onTogglePublishModal,
	} = useModal();

	/**
	 * @returns `string` DataURI
	 */
	const getPresenterScreenShot = useCallback(
		() => videoComponentRef.current.getPresenterScreenShot(),
		[]
	);

	/**
	 * @returns `string` DataURI
	 */
	const getPresentationScreenShot = useCallback(
		() => videoComponentRef.current.getPresentationScreenShot(),
		[]
	);

	const handleTimelineClick = useCallback(
		(time) => videoComponentRef.current.handleTimelineClick(time),
		[]
	);

	const timelineProps = useMemo(
		() => ({
			getPresenterScreenShot,
			getPresentationScreenShot,
			handleTimelineClick,
		}),
		[getPresentationScreenShot, getPresenterScreenShot, handleTimelineClick]
	);

	useEffect(() => {
		setXmlTxt(xml);
	}, [setXmlTxt]);

	const onClick = () => {
		const scenes = {
			scene: [
				{
					marker_in: '0:00:00:08.934',
					marker_out: '0:00:01:02.667',
				},
				{
					marker_in: '0:00:01:30.867',
					marker_out: '0:00:02:10.133',
				},
				{
					marker_in: '0:00:02:10.133',
					marker_out: '0:00:03:23.067',
				},
			],
		};

		const chapters = {
			_attributes: {
				property_update_marker_thumbnail:
					'https://educast.fccn.pt/clips/34114/cutting_tool_data/chapter_thumbnail.js?locale=en',
				property_validation_title: '/^.{0,50}$/',
			},
			chapter: [
				{
					marker_in: '0:00:01:02.667',
					title: '',
					marker_thumbnail: '0:00:01:02.667',
					thumbnail_url: {
						_attributes: {
							read_only: true,
						},
						_text:
							'https://educast.fccn.pt/img/clips/2jcdfpptkn/tmp/chapters/0000102667',
					},
				},
				{
					marker_in: '0:00:01:20.200',
					title: 'Capitulo 1',
					marker_thumbnail: '0:00:00:22.220',
					thumbnail_url: {
						_attributes: {
							read_only: true,
						},
						_text:
							'https://educast.fccn.pt/img/clips/2jcdfpptkn/tmp/chapters/0000022220',
					},
				},
				{
					marker_in: '0:00:02:10.133',
					title: 'Capitulo 2',
					marker_thumbnail: '0:00:00:26.227',
					thumbnail_url: {
						_attributes: {
							read_only: true,
						},
						_text:
							'https://educast.fccn.pt/img/clips/2jcdfpptkn/tmp/chapters/0000026227',
					},
				},
				{
					marker_in: '0:00:02:42.800',
					title: 'Capitulo 3',
					marker_thumbnail: '0:00:00:27.816',
					thumbnail_url: {
						_attributes: {
							read_only: true,
						},
						_text:
							'https://educast.fccn.pt/img/clips/2jcdfpptkn/tmp/chapters/0000027816',
					},
				},
			],
		};

		const metadados = {
			title: {
				_attributes: {
					label: 'Title',
					type: 'string',
					validation: '/^.{0,100}$/',
					validation_error_text: 'Title too long (max. 100 characters)',
					default: '',
					description: 'Title of this clip',
					position: '1',
				},
				_text: 'Editor',
			},
			subtitle: {
				_attributes: {
					label: 'Subtitle',
					type: 'string',
					validation: '/^.{0,100}$/',
					validation_error_text: 'Subitle too long (max. 100 characters)',
					default: '',
					description: 'Subtitle of this clip',
					position: '2',
				},
				_text: 'Subtitlo do Editor',
			},
			presenter: {
				_attributes: {
					label: 'Presenter',
					type: 'string',
					validation: '/^.{0,100}$/',
					validation_error_text: 'Presenter too long (max. 100 characters)',
					default: '',
					description: 'Who is the presenter in this clip',
					position: '3',
				},
				_text: 'Nelson Dias',
			},
			location: {
				_attributes: {
					label: 'Location',
					type: 'string',
					validation: '/^.{0,100}$/',
					validation_error_text: 'Location too long (max. 100 characters)',
					default: '',
					description: 'Where was the recording taken',
					position: '4',
				},
				_text: 'Lisboa',
			},
			issued_on: {
				_attributes: {
					label: 'Date',
					type: 'string',
					validation: '/^.{0,50}$/',
					validation_error_text: 'Date too long (max. 50 characters)',
					default: '',
					description:
						'When was the recording taken (the format DD.MM.YYYY [hh:mm] is recommanded)',
					position: '5',
				},
				_text: '13.02.2020 10:43',
			},
		};
		setMetadata(metadados);
		setChapters(chapters);
		setScenes(scenes);
	};

	const printXML = () => console.log(getCompleteXML());

	return (
		<Container fluid className="app">
			<SaveModal isOpen={isSaveModalOpen} onToggle={onToggleSaveModal} />
			<PublishModal
				isOpen={isPublishModalOpen}
				onToggle={onTogglePublishModal}
			/>
			<div className="video-div">
				<VideoContainer ref={videoComponentRef} />
			</div>
			<div className="edition-div">
				<div className="edition-div-container">
					<BrowserRouter>
						<Tabs step={step} setStep={setStep} timelineProps={timelineProps} />
					</BrowserRouter>
				</div>
				<div className="stepper-buttons-container">
					<div className="stepper-container">
						<StepperComponent step={step} />
					</div>
					<div className="app-buttons-container">
						<Button
							color="warning"
							className="app-buttons app-home-buttons"
							onClick={onToggleSaveModal}
						>
							<FaSave size="1rem" className="icon-btn" />
							Salvar
						</Button>
						<Button
							color="primary"
							className="app-buttons  app-home-buttons"
							onClick={onTogglePublishModal}
						>
							<FaShare size="1rem" className="icon-btn" />
							Publicar
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default App;
