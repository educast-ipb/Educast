import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import classNames from 'classnames';

import styles from './CustomSlider.module.scss';
import CustomCard from './CustomCard';
import { CustomRightArrow, CustomLeftArrow } from './SliderArrows';

const CustomSlider = ({
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresenterScreenShot,
	getPresentationScreenShot,
	selectChapter,
}) => {
	const carouselRef = useRef(null);
	const scrollbarRef = useRef(null);
	const [carouselDraggable, setCarouselDraggable] = useState(true);
	const [size, setSize] = useState([0, 0]);
	const [scrollBarValue, setScrollBarValue] = useState(0);
	const [disableScrollBar, setDisableScrollBar] = useState(false);
	const chs = useSelector((state) => state.sceneChapters.chapters);

	useEffect(() => {
		resizeWindow();
		window.addEventListener('resize', resizeWindow);
		return () => window.removeEventListener('resize', resizeWindow);
	});

	// Prevents carousel overflow by forcing maximum valid value.
	const resizeWindow = () => {
		setSize([window.innerWidth, window.innerHeight]);
		if (carouselRef.current.state) {
			const { transform, totalItems, slidesToShow } = carouselRef.current.state;
			if (totalItems <= slidesToShow) {
				carouselRef.current.setState({
					transform: 0,
					currentSlide: 0,
				});
			} else {
				const maxTranslateX = getMaxTranslateX();
				let value = maxTranslateX / 100;
				carouselRef.current.isAnimationAllowed = false;
				const max = getMaxScrollbarValue(value);
				const maxAllowedTransform = max * value;
				if (Math.abs(transform) > maxAllowedTransform) {
					carouselRef.current.setState({
						transform: -maxAllowedTransform,
						currentSlide:
							totalItems - slidesToShow < 0 ? 0 : totalItems - slidesToShow,
					});
				}
			}
		}
	};

	// Breakpoints in pixels for limiting how many cards will be shown.
	const responsive = {
		desktop: {
			breakpoint: {
				max: 3000,
				min: 1230,
			},
			items: 5,
		},
		mobile: {
			breakpoint: {
				max: 840,
				min: 0,
			},
			items: 2,
		},
		tablet: {
			breakpoint: {
				max: 1230,
				min: 840,
			},
			items: 3,
		},
	};

	useEffect(() => {
		// Maximum amount of cards that fits in screen size.
		const length = () => {
			const width = size[0];
			if (width > responsive.desktop.breakpoint.min) {
				return responsive.desktop.items;
			} else if (width > responsive.tablet.breakpoint.min) {
				return responsive.tablet.items;
			} else if (width > responsive.mobile.breakpoint.min) {
				return responsive.mobile.items;
			}
		};
		// Sets scrollbar width.
		setScrollBarValue(getScrollBarWidth(length(), chs.length));
	}, [chs.length, size, responsive]);

	// Calculates scrollbar width in percentage.
	const getScrollBarWidth = (itemsThatFit, total) => {
		let size = 0;
		if (total > 0 && total > itemsThatFit) {
			setDisableScrollBar(false);
			size = (itemsThatFit / total).toFixed(1) * 100;
			if (size > 80) {
				size = 80;
			} else if (size < 20) {
				size = 20;
			}
		} else {
			if (itemsThatFit !== 0) {
				setDisableScrollBar(true);
				size = 100;
			}
		}
		return size;
	};

	// Helper for disabling draggable action on carousel if card description is being edited.
	const isTextFieldBeingEdited = (isIt) => {
		setCarouselDraggable(!isIt);
	};

	// Deletes card and updates carousel state/scrollbar value.
	const modifiedDeleteChapterFunction = async (id) => {
		const deleted = await deleteChapterFunction(id);
		if (deleted === true) {
			if (scrollbarRef.current) {
				const {
					slidesToShow,
					totalItems,
					itemWidth,
					currentSlide,
					transform,
				} = carouselRef.current.state;
				scrollbarRef.current.value = 0;
				let nextTransform;
				let nextSlide;
				if (slidesToShow >= totalItems) {
					nextTransform = 0;
					nextSlide = 0;
				} else {
					nextSlide = currentSlide - 1 <= 0 ? 0 : currentSlide - 1;
					nextTransform = nextSlide * itemWidth;
				}
				carouselRef.current.setState({
					transform: -nextTransform,
					currentSlide: nextSlide,
				});
				const maxTranslateX = getMaxTranslateX();
				const value = maxTranslateX / 100;
				scrollbarRef.current.value = Math.round(Math.abs(transform) / value);
			}
		}
	};

	const NoChapters = () => {
		return (
			<div className={styles['zero-chapters']}>Nenhum Capítulo Criado</div>
		);
	};

	// Cards to be shown in carousel.
	const cardsToShow = () => {
		let order = 0;
		// return chapters.map((chapter) => {
		return chs.map((chapter) => {
			order++;
			return (
				<CustomCard
					key={chapter.id}
					chapter={chapter}
					deleteChapterFunction={() =>
						modifiedDeleteChapterFunction(chapter.id)
					}
					order={order}
					updateTitleFunction={updateTitleFunction}
					selectThumbnailFunction={selectThumbnailFunction}
					getPresenterScreenShot={getPresenterScreenShot}
					getPresentationScreenShot={getPresentationScreenShot}
					isTextFieldBeingEdited={isTextFieldBeingEdited}
					selectChapter={() => selectChapter(chapter.id)}
				></CustomCard>
			);
		});
	};

	// Helper for getting maximum scrollbar value.
	const getMaxTranslateX = () => {
		if (carouselRef.current) {
			const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
			if (totalItems === slidesToShow) {
				return itemWidth;
			}
			return Math.round(itemWidth * (totalItems - slidesToShow));
		}
	};

	// Helper for getting maximum scrollbar value.
	const getMaxScrollbarValue = (value) => {
		const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
		return (itemWidth * (totalItems - slidesToShow)) / value;
	};

	// Carousel's scrollbar.
	const ChapterScrollbar = () => {
		carouselRef.current.isAnimationAllowed = false;
		let value = 0.0;
		if (carouselRef) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const { transform, itemWidth } = carouselRef.current.state;
		const scrollBarOnChange = (e) => {
			carouselRef.current.isAnimationAllowed = false;
			const nextTransform = e.target.value * value;
			const nextSlide = Math.round(nextTransform / itemWidth);
			carouselRef.current.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
			if (e.target.value === 0) {
				carouselRef.current.isAnimationAllowed = true;
			}
		};
		return (
			<div className={styles['custom-slider']}>
				<input
					type="range"
					ref={scrollbarRef}
					value={Math.round(Math.abs(transform) / value)}
					max={getMaxScrollbarValue(value)}
					onChange={scrollBarOnChange}
					disabled={disableScrollBar}
					className={classNames(
						styles[`custom-slider__input${scrollBarValue}`],
						styles[`custom-slider__input`]
					)}
				/>
			</div>
		);
	};

	return (
		<div className={styles['root-slider']}>
			<CustomLeftArrow carouselRef={carouselRef} />
			<Carousel
				className={styles['custom-carousel']}
				additionalTransform={0}
				ssr={false}
				ref={carouselRef}
				arrows={false}
				keyBoardControl={false}
				partialVisbile={false}
				customButtonGroup={
					chs.length === 0 ? <NoChapters /> : <ChapterScrollbar />
				}
				infinite={false}
				itemClass={styles['slider-image-item']}
				containerClass={styles['carousel-container-with-scrollBar']}
				draggable={carouselDraggable}
				responsive={responsive}
			>
				{cardsToShow()}
			</Carousel>
			<CustomRightArrow carouselRef={carouselRef} />
		</div>
	);
};

export default CustomSlider;
