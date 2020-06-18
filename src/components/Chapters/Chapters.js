import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';

import CustomSlider from './CustomSlider';
import styles from './Chapters.module.scss';

const Chapters = ({ getPresenterScreenShot, getPresentationScreenShot }) => {
	const chs = useSelector((state) => state.sceneChapters.chapters);
	const dispatch = useDispatch();

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
		(chId, newImg) => {
			dispatch({ type: 'UPDATE_CHAPTER_IMG', img: newImg, id: chId });
		},
		[dispatch]
	);

	const updateChapterTitle = useCallback(
		(chId, newTitle) => {
			dispatch({ type: 'UPDATE_CHAPTER_TITLE', title: newTitle, id: chId });
		},
		[dispatch]
	);

	const selectChapter = useCallback(
		(id) => {
			const updatedChapters = chs.map((ch) => {
				if (id === ch.id) {
					ch.isSelected = true;
				} else {
					ch.isSelected = false;
				}
				return ch;
			});
			dispatch({ type: 'SET_CHAPTERS', chapters: updatedChapters });
		},
		[chs, dispatch]
	);

	const deleteChapterFunction = useCallback(async (id) => {
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
			customClass: {
				confirmButton: styles['no-border'],
				cancelButton: styles['no-border'],
				popup: styles['no-border'],
			},
		}).then((result) => {
			if (result.value) {
				deleted = true;
				excludeChapter(id);
			}
		});
		return deleted;
	}, [chs, excludeChapter]);

	return (
		<CustomSlider
			deleteChapterFunction={deleteChapterFunction}
			updateTitleFunction={updateChapterTitle}
			selectThumbnailFunction={updateChapterImg}
			getPresenterScreenShot={getPresenterScreenShot}
			getPresentationScreenShot={getPresentationScreenShot}
			selectChapter={selectChapter}
		/>
	);
};

export default Chapters;
