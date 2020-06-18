import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import styles from './CustomSlider.module.scss';
import CustomCard from './CustomCard';
import { CustomRightArrow, CustomLeftArrow } from './SliderArrows';

// Breakpoints in pixels for limiting how many cards will be shown.
const responsive = {
	Yes: {
		breakpoint: {
			max: 10000,
			min: 2240,
		},
		items: 10,
	},
	FHDPlus: {
		breakpoint: {
			max: 2240,
			min: 2040,
		},
		items: 9,
	},
	FHD: {
		breakpoint: {
			max: 2040,
			min: 1840,
		},
		items: 8,
	},
	FHDMinus: {
		breakpoint: {
			max: 1840,
			min: 1640,
		},
		items: 7,
	},
	desktop: {
		breakpoint: {
			max: 1640,
			min: 1440,
		},
		items: 6,
	},
	HDPlus: {
		breakpoint: {
			max: 1440,
			min: 1240,
		},
		items: 5,
	},
	HDMinus: {
		breakpoint: {
			max: 1240,
			min: 1040,
		},
		items: 4,
	},
	tabletPlus: {
		breakpoint: {
			max: 1040,
			min: 840,
		},
		items: 3,
	},
	tabletMinus: {
		breakpoint: {
			max: 840,
			min: 640,
		},
		items: 2,
	},
	mobile: {
		breakpoint: {
			max: 640,
			min: 420,
		},
		items: 2,
	},
	mobileMinus: {
		breakpoint: {
			max: 420,
			min: 0,
		},
		items: 1,
	},
};

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
	const styling = makeStyles({
		scrollBar: {
			'&::-webkit-slider-thumb': {
				width: scrollBarValue + '%',
			},
		},
	});
	const classes = styling();
	const chs = useSelector((state) => state.sceneChapters.chapters);

	// Prevents carousel overflow caused by sliding by forcing maximum valid value.
	const resizeWindow = useCallback(() => {
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
	}, []);

	useEffect(() => {
		resizeWindow();
		window.addEventListener('resize', resizeWindow);
		return () => window.removeEventListener('resize', resizeWindow);
	}, [resizeWindow]);

	useEffect(() => {
		// Maximum amount of cards that fits in screen size.
		const length = () => {
			const width = size[0];
			for (var screenType in responsive) {
				if (
					width >= responsive[screenType].breakpoint.min &&
					width <= responsive[screenType].breakpoint.max
				) {
					return responsive[screenType].items;
				}
			}
		};
		// Sets scrollbar width.
		setScrollBarValue(getScrollBarWidth(length(), chs.length));
	}, [chs.length, size]);

	// Calculates scrollbar width in percentage.
	const getScrollBarWidth = (itemsThatFit, total) => {
		let size = 0;
		if (total > 0 && total > itemsThatFit) {
			setDisableScrollBar(false);
			size = (itemsThatFit / total) * 100;
			if (size > 90) {
				size = 90;
			} else if (size < 10) {
				size = 10;
			}
		} else {
			if (itemsThatFit !== 0) {
				setDisableScrollBar(true);
				size = 100;
			}
		}
		return size;
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

	// Helper for disabling draggable action on carousel if card description is being edited.
	const shouldDraggableBeDisabled = useCallback((yes) => {
		setCarouselDraggable(!yes);
	}, []);

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
					disableDraggableCarousel={shouldDraggableBeDisabled}
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
		let value = 0.0;
		if (carouselRef) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const { transform, itemWidth } = carouselRef.current.state;
		const scrollBarOnChange = (e) => {
			if (carouselRef.current.isAnimationAllowed) {
				carouselRef.current.isAnimationAllowed = false;
			}
			const nextTransform = e.target.value * value;
			const nextSlide = Math.round(nextTransform / itemWidth);
			carouselRef.current.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
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
						styles[`custom-slider__input`],
						classes.scrollBar
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
				// ssr={false}
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
