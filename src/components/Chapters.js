import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import CustomSlider from './CustomSlider';
import ImageUpload from './ImageUpload';

const Chapters = ({ props }) => {
	const [chapters, setChapters] = useState([]);
	// const [files, setFiles] = useState([]);

	const initialChapters = [
		{
			id: 1,
			initTime: 1,
			finalTime: 2,
			title: 'Chapter 1',
			thumbnail: 'primaryScreen',
		},
		{
			id: 2,
			initTime: 2,
			finalTime: 3,
			title: 'Chapter 2',
			thumbnail: 'primaryScreen',
		},
		{
			id: 3,
			initTime: 3,
			finalTime: 4,
			title: 'Chapter 3',
			thumbnail: 'primaryScreen',
		},
		{
			id: 4,
			initTime: 4,
			finalTime: 5,
			title: 'Chapter 4',
			thumbnail: 'primaryScreen',
		},
		{
			id: 5,
			initTime: 5,
			finalTime: 6,
			title: 'Chapter 5',
			thumbnail: 'primaryScreen',
		},
	];

	useEffect(() => {
		setChapters(initialChapters);
	}, []);

	const selectThumbnailFunction = (chapterId, path) => {
		console.log(chapterId, ' different thumbnail selected');
		setChapters(
			chapters.filter(chapter => {
				if (chapter.id === chapterId) {
					chapter.thumbnail = path;
				}
				return chapter;
			})
		);
	};

	const updateTitleFunction = (id, newTitle) => {
		setChapters(
			chapters.filter(chapter => {
				if (chapter.id === id) {
					chapter.thumbnail = newTitle;
				}
				console.log('title changed', newTitle);
				return chapter;
			})
		);
	};

	const deleteChapterFunction = id => {
		const chapter = chapters.find(chapter => chapter.id === id);
		Swal.fire({
			text: 'Excluir Capítulo: ' + chapter.title + '?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Excluir',
			cancelButtonText: 'Cancelar',
		}).then(result => {
			if (result.value) {
				setChapters(
					chapters.filter(chapter => {
						return chapter.id !== id;
					})
				);
			}
		});
	};

	// const handleFilesAddition = (file) => {
	//   setFiles(files.concat(file));
	// }

	return (
		<div>
			<CustomSlider
				chapters={chapters}
				deleteChapterFunction={deleteChapterFunction}
				updateTitleFunction={updateTitleFunction}
				selectThumbnailFunction={selectThumbnailFunction}
			/>
			{/* <ImageUpload
        // onFilesAdded={handleFilesAddition}
        // disabled={this.state.uploading || this.state.successfullUploaded}
      /> */}
		</div>
	);
};

export default Chapters;