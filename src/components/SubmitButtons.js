import React from 'react';

import { Button } from 'reactstrap';
import { FaSave, FaShare } from 'react-icons/fa';

import useModal from '../hooks/useModal';
import { useXml } from '../hooks/useXml';

import SaveModal from './SaveModal';
import PublishModal from './PublishModal';
const { xml } = require('../resources/base.xml.js');

const SubmitButtons = () => {
	const { setScenes, setChapters, setMetadata, getCompleteXML } = useXml(xml);
	const { isOpen: isSaveModalOpen, onToggle: onToggleSaveModal } = useModal();
	const {
		isOpen: isPublishModalOpen,
		onToggle: onTogglePublishModal,
	} = useModal();

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
		<>
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
			<SaveModal isOpen={isSaveModalOpen} onToggle={onToggleSaveModal} />
			<PublishModal
				isOpen={isPublishModalOpen}
				onToggle={onTogglePublishModal}
			/>
		</>
	);
};

export default SubmitButtons;
