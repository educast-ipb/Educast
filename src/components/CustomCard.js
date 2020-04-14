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
	FaImage,
} from 'react-icons/fa';
import Box from '@material-ui/core/Box';
import EditableTextField from './EditableTextField';
import styles from './CustomCard.module.css';

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
		// verticalAlign: 'middle',
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
		// paddingRight: '4px',
		// paddingLeft: '15px',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	cardHeader: {
		background: '#12AADA',
		color: 'white',
		padding: '12px',
		maxHeight: '35px',
	},
	cardActions: {
		background: '#F3E9FC',
	},
	deleteIcon: {
		position: 'absolute',
		top:'2px',
		left: '2px',
	},
	thumbnailIcons: {
		position: 'absolute',
		top:'5px',
		left: '4px',
		// verticalAlign: 'center',
	}
});

// Temporary functions
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
}) => {
	const [imageFileUpload, setImageFileUpload] = useState('');
	const [thumbnailImage, setThumbnailImage] = useState('');
	const [fileSelector, setFileSelector] = useState('');
	const classes = useStyles();
	// const [video, setVideo] = useState('');
	const imageFileInputRef = React.createRef();

	// const video = document.querySelector("video");
	// const canvas = document.querySelector("canvas");
	// const context = canvas.getContext("2d");
	// var w, h, ratio;
	// //add loadedmetadata which will helps to identify video attributes......
	// video.addEventListener(
	//   "loadedmetadata",
	//   function() {
	//     ratio = video.videoWidth / video.videoHeight;
	//     w = video.videoWidth - 100;
	//     h = parseInt(w / ratio, 10);
	//     canvas.width = w;
	//     canvas.height = h;
	//     console.log(w);
	//   },
	//   false
	// );

	useEffect(() => {
		setThumbnailImage(images[0]); //select presentation snapshot by default
		setFileSelector(buildFileSelector());
	}, []);

	const handleThumbnailSelection = (path) => {
		selectThumbnailFunction(chapter.id, path);
		if (path === 'primary') {
			chapter.thumbnail = 'primary'; //take screenshot and replace this line
			setThumbnailImage(images[0]); //extract snapshot
		} else if (path === 'secondary') {
			chapter.thumbnail = 'secondary'; //take screenshot and replace this line
			setThumbnailImage(images[1]); //extract snapshot
		} else {
			//upload, import/show image
			chapter.thumbnail = path;
			setThumbnailImage(images[2]); //upload function/import image in path
		}
	};

	const buildFileSelector = () => {
		const fileSelector = document.createElement('input');
		fileSelector.setAttribute('type', 'file');
		fileSelector.setAttribute('ref', imageFileInputRef);
		fileSelector.setAttribute('multiple', 'multiple');
		return fileSelector;
	};

	const handleImageChange = (e) => {
		console.log('hey');
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		console.log(file);
		reader.onloadend = () => {
			setImageFileUpload(file);
			console.log(reader.result);
			// this.setState({
			// 	file: file,
			// 	imagePreviewUrl: reader.result,
			// });
		};
		reader.readAsDataURL(file);
	};

	const handleImageUpload = (event) => {
		event.preventDefault();
		fileSelector.click();
		// console.log(imageFileInputRef.current.files[0].name);
	};

	const extractVideoSnapshot = () => {
		console.log('snapshotted');
	};

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
					<Box position="absolute" top="17%" left="80%">
					<Button
						key={chapter.id}
						className={classes.deleteButton}
						startIcon={<FaTimes className={classes.deleteIcon} size='14px'/>}
						onClick={deleteChapterFunction}
					/>
					</Box>
				}
			/>
			<CardMedia
				className={classes.media}
				image={thumbnailImage}
				title={'burger'}
			>
				<Box position="absolute" top="10%" left="81%">
					<Button
						className={classes.thumbnailButton}
						startIcon={<FaImages className={classes.thumbnailIcons}/>}
						onClick={() => handleThumbnailSelection('primary')}
					/>
				</Box>
				<Box position="absolute" top="37%" left="81%">
					<Button
						className={classes.thumbnailButton}
						startIcon={<FaChalkboardTeacher className={classes.thumbnailIcons}/>}
						onClick={() => handleThumbnailSelection('secondary')}
					/>
				</Box>
				<Box position="absolute" top="64%" left="81%">
					<Button
						key={chapter.id}
						onClick={handleImageUpload}
						className={classes.thumbnailButton}
						startIcon={<FaUpload className={classes.thumbnailIcons}/>}
						// onClick={() => handleThumbnailSelection('upload')}
						// onClick={() => handleVideoUpload()}
					/>
				</Box>
				{/* <Box position="absolute" top="80%" left="85%">
			<Button
			key={chapter.id}
			className={classes.thumbnailButton}
			startIcon={<FaImage />}
			onClick={() => extractVideoSnapshot()}
			/>
		</Box> */}
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
