import React, { useState, useRef, useCallback, useMemo } from 'react';
import './App.scss';

import VideoContainer from './components/VideoPlayer/VideoContainer';
import Tabs from './components/Tabs';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import StepperComponent from './components/Stepper';

import SubmitButtons from './components/SubmitButtons';

function App() {
	const [step, setStep] = useState(0);
	const videoComponentRef = useRef(null);

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

	return (
		<Container fluid className="app">
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
					<SubmitButtons />
				</div>
			</div>
		</Container>
	);
}

export default App;
