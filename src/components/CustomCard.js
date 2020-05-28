import React, { useState, useEffect } from 'react';
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
		marginTop: '3%',
		maxWidth: '250px',
	},
	media: {
		height: '16vh',
		width: '100%',
		position: 'relative',
	},
	title: {
		fontSize: '2vh',
	},
	deleteButton: {
		borderRadius: '0px',
		paddingTop: '3%',
		paddingRight: '2%',
		maxWidth: '2.1vh',
		maxHeight: '2.1vh',
		minWidth: '2.1vh',
		minHeight: '2.1vh',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	thumbnailButton: {
		borderRadius: '0px',
		maxWidth: '3vh',
		maxHeight: '3vh',
		minWidth: '3vh',
		minHeight: '3vh',
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
		cursor: 'pointer',
		padding: '1.5vh',
		maxHeight: '4vh',

		minHeight: '4vh',
	},
	box1: {
		paddingTop: '0.6rem',
		paddingRight: '0.6rem',
	},
	box2: {
		paddingTop: '0.6rem',
		paddingRight: '0.6rem',
	},
	box3: {
		paddingTop: '0.6rem',
		paddingRight: '0.6rem',
	},
	cardActions: {
		background: '#F3E9FC',
		maxHeight: '9vh',
	},
	deleteIcon: {
		// position: 'absolute',
		// maxHeight: '1.3rem',
		// minHeight: '1.3rem',
		// top: '-0.099rem',
		// left: '-0.15rem',
		position: 'absolute',
		top: '12%',
		left: '11%',
		maxWidth: '1.7vh',
		maxHeight: '1.7vh',
		minWidth: '1.7vh',
		minHeight: '1.7vh',
	},
	thumbnailIcons: {
		position: 'absolute',
		top: '14%',
		left: '16%',
		maxWidth: '2vh',
		maxHeight: '2vh',
		minWidth: '2vh',
		minHeight: '2vh',
	},
});

const CustomCard = ({
	chapter,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresentationScreenShot,
	getPresenterScreenShot,
	isTextFieldBeingEdited,
}) => {
	const [thumbnailImage, setThumbnailImage] = useState('');
	const classes = useStyles();

	useEffect(() => {
		//select presentation snapshot by default
		setThumbnailImage(getPresentationScreenShot());
	}, []);

	const handleThumbnailSelection = (path) => {
		if (path === 'primary') {
			chapter.thumbnail = getPresentationScreenShot();
		} else if (path === 'secondary') {
			chapter.thumbnail = getPresenterScreenShot();
		}
		selectThumbnailFunction(chapter.id, chapter.thumbnail);
		setThumbnailImage(chapter.thumbnail);
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
					// <Box
					// 	// display="flex"
					// 	// justifyContent="center"
					// 	className={classes.deleteBox}
					// >
						<Button
							key={chapter.id}
							className={classes.deleteButton}
							startIcon={<FaTimes className={classes.deleteIcon} />}
							onClick={() => deleteChapterFunction()}
						/>
					// </Box>
				}
			></CardHeader>
			<div className={styles['unselectable-image']}>
				<CardMedia className={classes.media} image={thumbnailImage}>
					<Box
						display="flex"
						justifyContent="flex-end"
						className={classes.box1}
					>
						<Button
							className={classes.thumbnailButton}
							startIcon={<FaImages className={classes.thumbnailIcons} />}
							onClick={() => handleThumbnailSelection('primary')}
						/>
					</Box>
					<Box
						display="flex"
						justifyContent="flex-end"
						className={classes.box2}
					>
						<Button
							className={classes.thumbnailButton}
							startIcon={
								<FaChalkboardTeacher className={classes.thumbnailIcons} />
							}
							onClick={() => handleThumbnailSelection('secondary')}
						/>
					</Box>
					<Box
						display="flex"
						justifyContent="flex-end"
						className={classes.box3}
					>
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
			</div>
			<div className={classes.cardActions}>
				<div className={styles['CustomCard__TimeLabel']}>
					In {chapter.initTime}
				</div>
				<EditableTextField
					type="text"
					value={chapter.title}
					updateTitleFunction={updateTitleFunction}
					chapter={chapter}
					isTextFieldBeingEdited={isTextFieldBeingEdited}
				/>
			</div>
		</Card>
	);
};

export default CustomCard;