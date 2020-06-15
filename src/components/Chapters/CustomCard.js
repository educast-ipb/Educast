import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
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
import styles from './CustomCard.module.scss';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles({
	root: {
		minWidth: '12.5rem',
		maxWidth: '12.5rem',
		minHeight: '12.8125rem',
		maxHeight: '12.8125rem',
	},
	cardHeader: {
		display: 'flex',
		flexDirection: 'row',
		color: 'white',
		width: '100%',
		maxHeight: '1.875rem', // 30px
		minHeight: '1.875rem',
	},
	cardMedia: {
		maxHeight: '7.1875rem', // 115px
		minHeight: '7.1875rem',
		width: '100%',
	},
	title: {
		cursor: 'pointer',
		paddingLeft: '0.625rem', // 10px
		paddingTop: '0.25rem',
		fontSize: '0.9375rem',
	},
	deleteButton: {
		'&:focus': {
			outline: 0,
		},
		borderRadius: '0px',
		maxWidth: '0.9375rem',
		maxHeight: '0.9375rem',
		minWidth: '0.9375rem',
		minHeight: '0.9375rem',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	deleteBox: {
		marginLeft: 'auto',
		order: '2',
		paddingTop: '0.125rem', // 3px
		paddingRight: '0.4375rem', // 7px
	},
	thumbnailButton: {
		'&:focus': {
			outline: 0,
		},
		borderRadius: '0px',
		maxWidth: '1.5625rem',
		maxHeight: '1.5625rem',
		minWidth: '1.5625rem',
		minHeight: '1.5625rem',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	boxes: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '0.4375rem',
		paddingRight: '0.5rem',
	},
	deleteIcon: {
		maxWidth: '0.8125rem',
		maxHeight: '0.8125rem',
		minWidth: '0.8125rem',
		minHeight: '0.8125rem',
	},
	thumbnailIcons: {
		maxWidth: '1rem',
		maxHeight: '1rem',
		minWidth: '1rem',
		minHeight: '1rem',
	},
});

const CustomCard = ({
	order,
	chapter,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresentationScreenShot,
	getPresenterScreenShot,
	isTextFieldBeingEdited,
	selectChapter,
}) => {
	const [thumbnailImage, setThumbnailImage] = useState('');
	const classes = useStyles();

	useEffect(() => {
		setThumbnailImage(chapter.img);
	}, [chapter.img]);

	const handleThumbnailSelection = (path) => {
		if (path === 'primary') {
			chapter.img = getPresentationScreenShot();
		} else if (path === 'secondary') {
			chapter.img = getPresenterScreenShot();
		}
		selectThumbnailFunction(chapter.id, chapter.img);
		setThumbnailImage(chapter.img);
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
		<div>
			<Card className={classes.root} square={true}>
				<CardMedia
					className={classes.cardHeader}
					style={
						chapter.isSelected
							? { background: '#F69333' }
							: { background: '#009bff' }
					}
				>
					<Typography
						onClick={() => selectChapter()}
						className={classes.title}
						variant="h5"
						component="h5"
					>
						Capítulo {order}
					</Typography>
					<Box className={classes.deleteBox}>
						<Button
							key={chapter.id}
							className={classes.deleteButton}
							onClick={() => deleteChapterFunction()}
						>
							<FaTimes className={classes.deleteIcon} />
						</Button>
					</Box>
				</CardMedia>
				<div className={styles['unselectable-image']}>
					<CardMedia className={classes.cardMedia} image={thumbnailImage}>
						<Box
							display="flex"
							justifyContent="flex-end"
							paddingTop="0.8125rem"
							paddingRight="0.5rem"
						>
							<Button
								className={classes.thumbnailButton}
								onClick={() => handleThumbnailSelection('primary')}
							>
								<FaImages className={classes.thumbnailIcons} />
							</Button>
						</Box>
						<Box className={classes.boxes}>
							<Button
								className={classes.thumbnailButton}
								onClick={() => handleThumbnailSelection('secondary')}
							>
								<FaChalkboardTeacher className={classes.thumbnailIcons} />
							</Button>
						</Box>
						<Box className={classes.boxes}>
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Button
									key={chapter.id}
									className={classes.thumbnailButton}
									onClick={open}
								>
									<FaUpload className={classes.thumbnailIcons} />
								</Button>
							</div>
						</Box>
					</CardMedia>
				</div>
				<div className={styles['CustomCard__TimeLabel']}>
					In {chapter.position}
				</div>
				<EditableTextField
					type="text"
					value={chapter.title}
					updateTitleFunction={updateTitleFunction}
					chapter={chapter}
					isTextFieldBeingEdited={isTextFieldBeingEdited}
				/>
			</Card>
		</div>
	);
};

export default CustomCard;
