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

function App() {
	const [step, setStep] = useState(0);
	const videoComponentRef = useRef(null);
	const { setScenes, setChapters, setMetadata, setXmlTxt } = useXml();

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
		fetch(
			'https://gist.githubusercontent.com/eboliveira/6a17fd43abbbfb2a1486ef698f3bed0d/raw/99d0d046c92ee3eda65c16690854f4883650f8b6/save_editor.xml'
		).then((f) => {
			f.text().then((t) => {
				setXmlTxt(t);
			});
		});
	}, []);

	const onClick = () => {
		setScenes([]);
	};

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
