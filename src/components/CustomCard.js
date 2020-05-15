import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
	FaUpload,
	FaImages,
	FaTimes,
	FaChalkboardTeacher,
} from 'react-icons/fa';
import Box from '@material-ui/core/Box';
import EditableTextField from './EditableTextField';
import styles from './CustomCard.module.css';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles({
	root: {
		marginTop: '40px',
		maxWidth: '210px',
	},
	media: {
		height: 140,
		width: '100%',
		position: 'relative',
	},
	title: {
		fontSize: 17,
	},
	deleteButton: {
		borderRadius: '1px',
		maxWidth: '18px',
		maxHeight: '18px',
		minWidth: '18px',
		minHeight: '18px',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	thumbnailButton: {
		borderRadius: '1px',
		maxWidth: '30px',
		maxHeight: '30px',
		minWidth: '30px',
		minHeight: '30px',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	cardHeader: {
		background: '#009bff',
		color: 'white',
		padding: '12px',
		maxHeight: '35px',
	},
	cardActions: {
		background: '#F3E9FC',
	},
	deleteIcon: {
		position: 'absolute',
		top: '2px',
		left: '2px',
	},
	thumbnailIcons: {
		position: 'absolute',
		top: '5px',
		left: '4px',
	},
});

function importAll(r) {
	return r.keys().map(r);
}
const images = importAll(
	require.context('../sampleImages/', false, /\.(png|jpe?g|svg)$/)
);

const CustomCard = ({
	chapter,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresentationScreenShot,
	getPresenterScreenShot,
}) => {
	const [thumbnailImage, setThumbnailImage] = useState('');
	const classes = useStyles();

	useEffect(() => {
		//select presentation snapshot by default
		setThumbnailImage(images[0]);
	}, []);

	const handleThumbnailSelection = (path) => {
		selectThumbnailFunction(chapter.id, path);
		if (path === 'primary') {
			chapter.thumbnail = 'primary';
			// setThumbnailImage(images[0]);
		} else if (path === 'secondary') {
			chapter.thumbnail = 'secondary';
		}
	};

	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		noClick: true,
		noKeyboard: true,
		onDrop: (acceptedFiles) => {
			const acceptedFile = acceptedFiles[0];
			const image = Object.assign(acceptedFile, {
				preview: URL.createObjectURL(acceptedFile),
			});
			setThumbnailImage(image.preview);
			selectThumbnailFunction(chapter.id, image.preview);
		},
	});

	return (
		<Card className={classes.root} square={true}>
			<CardHeader
				className={classes.cardHeader}
				title={
					<Typography className={classes.title} variant="h5" component="h5">
						Capítulo {chapter.id}
					</Typography>
				}
				action={
					<Button
						key={chapter.id}
						className={classes.deleteButton}
						startIcon={<FaTimes className={classes.deleteIcon} size="14px" />}
						onClick={() => deleteChapterFunction()}
					/>
				}
			/>
			<CardMedia className={classes.media} image={thumbnailImage}>
				<Box position="absolute" top="10%" left="81%">
					<Button
						className={classes.thumbnailButton}
						startIcon={<FaImages className={classes.thumbnailIcons} />}
						onClick={() => handleThumbnailSelection('primary')}
					/>
				</Box>
				<Box position="absolute" top="37%" left="81%">
					<Button
						className={classes.thumbnailButton}
						startIcon={
							<FaChalkboardTeacher className={classes.thumbnailIcons} />
						}
						onClick={() => handleThumbnailSelection('secondary')}
					/>
				</Box>
				<Box position="absolute" top="64%" left="81%">
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<Button
							key={chapter.id}
							className={classes.thumbnailButton}
							onClick={open}
							startIcon={<FaUpload className={classes.thumbnailIcons} />}
						/>
					</div>
				</Box>
			</CardMedia>
			<div className={classes.cardActions}>
				<div className={styles['CustomCard__TimeLabel']}>
					In {chapter.initTime}::{chapter.finalTime}
				</div>
				<EditableTextField
					type="text"
					value={chapter.title}
					updateTitleFunction={updateTitleFunction}
					chapter={chapter}
				/>
			</div>
		</Card>
	);
};

export default CustomCard;
