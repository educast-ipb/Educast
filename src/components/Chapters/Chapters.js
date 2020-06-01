import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import CustomSlider from './CustomSlider';
import { useDispatch, useSelector } from 'react-redux';

const Chapters = ({ getPresenterScreenShot, getPresentationScreenShot }) => {
	const [chapters, setChapters] = useState([]);
	const chs = useSelector((state) => state.sceneChapters.chapters);
	const videoInSeconds = useSelector((state) => state.video.duration);
	const dispatch = useDispatch();

	useEffect(() => {
		const c = chs.map((ch) => {
			let positionToSeconds = Math.floor(videoInSeconds * ch.position);
			const temp = {
				id: ch.id,
				img: ch.img,
				position: hhmmss(positionToSeconds),
				title: ch.title,
			};
			return temp;
		});
		setChapters(c);
	}, []);

	function pad(num) {
		return ('0' + num).slice(-2);
	}

	function hhmmss(secs) {
		let minutes = Math.floor(secs / 60);
		secs = secs % 60;
		let hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
	}

	const excludeChapter = useCallback(
		(id) => {
			const updatedChapters = chs.filter((val) => {
				return val.id !== id;
			});
			dispatch({ type: 'SET_CHAPTERS', chapters: updatedChapters });
		},
		[chs, dispatch]
	);

	const updateChapterImg = useCallback(
		(newImg, chId) => {
			dispatch({ type: 'UPDATE_CHAPTER_IMG', img: newImg, id: chId });
		},
		[dispatch]
	);

	const updateChapterTitle = useCallback(
		(newTitle, chId) => {
			dispatch({ type: 'UPDATE_CHAPTER_TITLE', title: newTitle, id: chId });
		},
		[dispatch]
	);

	const selectThumbnailFunction = (chapterId, path) => {
		setChapters(
			chapters.filter((chapter) => {
				if (chapter.id === chapterId) {
					chapter.img = path;
				}
				return chapter;
			})
		);
		updateChapterImg(path, chapterId);
	};

	// Fix this function
	const updateTitleFunction = (id, newTitle) => {
		updateChapterTitle(newTitle, id);
		setChapters(
			chapters.filter((chapter) => {
				if (chapter.id === id) {
					chapter.thumbnail = newTitle;
				}
				return chapter;
			})
		);
	};

	const deleteChapterFunction = async (id) => {
		const chapter = chs.find((chapter) => chapter.id === id);
		let deleted = false;
		const chTitle = chapter.title !== undefined ? chapter.title : '';
		await Swal.fire({
			text: 'Excluir Capítulo: ' + chTitle + '?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Excluir',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.value) {
				deleted = true;
				// next line may or may not generate a bug
				setChapters(
					chapters.filter((chapter) => {
						return chapter.id !== id;
					})
				);
				excludeChapter(id);
			}
		});
		return deleted;
	};

	return (
		<CustomSlider
			chapters={chapters}
			deleteChapterFunction={deleteChapterFunction}
			updateTitleFunction={updateTitleFunction}
			selectThumbnailFunction={selectThumbnailFunction}
			getPresenterScreenShot={getPresenterScreenShot}
			getPresentationScreenShot={getPresentationScreenShot}
		/>
	);
};

export default Chapters;
