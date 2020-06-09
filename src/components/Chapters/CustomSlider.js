import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
import 'react-multi-carousel/lib/styles.css';
import IconButton from '@material-ui/core/IconButton';
import styles from './CustomSlider.module.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import classNames from 'classnames';

const useStyles = makeStyles({
	leftArrow: {
		position: 'relative',
		color: '#0099ff',
		fontSize: '3.5rem',
		'&:hover': {
			background: 'rgba(0, 0, 0, 0)',
		},
		'&:focus': {
			outline: 'none',
		},
	},
	rightArrow: {
		position: 'relative',
		color: '#0099ff',
		fontSize: '3.5rem',
		'&:hover': {
			background: 'rgba(0, 0, 0, 0)',
		},
		'&:focus': {
			outline: 'none',
		},
	},
});

const CustomSlider = ({
	chapters,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresenterScreenShot,
	getPresentationScreenShot,
}) => {
	const carouselRef = useRef(null);
	const scrollbarRef = useRef(null);
	const [totItems, setTotItems] = useState(0);
	const classes = useStyles();
	const [carouselDraggable, setCarouselDraggable] = useState(true);
	const [size, setSize] = useState([0, 0]);
	const [scrollBarValue, setScrollBarValue] = useState(0);
	const [disableScrollBar, setDisableScrollBar] = useState(false);

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

	useEffect(() => {
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
		setScrollBarValue(getScrollBarWidth(length(), chapters.length));
	}, [chapters.length, size]);

	useEffect(() => {
		resizeWindow();
		window.addEventListener('resize', resizeWindow);
		return () => window.removeEventListener('resize', resizeWindow);
	}, []);

	const isTextFieldBeingEdited = (isIt) => {
		setCarouselDraggable(!isIt);
	};

	const modifiedDeleteChapterFunction = async (id) => {
		const deleted = await deleteChapterFunction(id);
		if (deleted === true) {
			setTotItems(totItems - 1);
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

	const cardsToShow = () => {
		let order = 0;
		return chapters.map((chapter) => {
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
				></CustomCard>
			);
		});
	};

	const getMaxTranslateX = () => {
		if (carouselRef.current) {
			const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
			if (totalItems === slidesToShow) {
				return itemWidth;
			}
			return Math.round(itemWidth * (totalItems - slidesToShow));
		}
	};

	const getMaxScrollbarValue = (value) => {
		const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
		return (itemWidth * (totalItems - slidesToShow)) / value;
	};

	const CustomRightArrow = () => {
		let value = 0;
		if (carouselRef.current) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const handleOnClick = () => {
			carouselRef.current.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carouselRef.current.state;
			const max = getMaxScrollbarValue(value);
			let nextTransform;
			let nextSlide;
			const maxSlides = totalItems - slidesToShow;
			const maxTransform = max * value;
			if (slidesToShow >= totalItems) {
				nextTransform = 0;
				nextSlide = 0;
			} else {
				nextSlide =
					currentSlide + 1 > maxSlides ? currentSlide : currentSlide + 1;
				if (nextSlide === currentSlide) {
					nextTransform = maxTransform;
				} else {
					nextTransform = nextSlide * itemWidth;
					if (nextSlide >= maxSlides) {
						nextTransform = maxTransform;
					}
				}
			}
			carouselRef.current.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
		};
		return (
			<IconButton
				variant="outlined"
				className={classes.rightArrow}
				onClick={() => handleOnClick()}
			>
				<FaChevronRight className={styles['right-arrow-icon']} />
			</IconButton>
		);
	};

	const CustomLeftArrow = () => {
		const handleOnClick = () => {
			carouselRef.current.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carouselRef.current.state;
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
		};
		return (
			<IconButton className={classes.leftArrow} onClick={() => handleOnClick()}>
				<FaChevronLeft />
			</IconButton>
		);
	};

	const ChapterScrollbar = () => {
		carouselRef.current.isAnimationAllowed = true;
		let value = 0.0;
		if (carouselRef) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const { transform, itemWidth } = carouselRef.current.state;
		return (
			<div className={styles['custom-slider']}>
				<input
					type="range"
					ref={scrollbarRef}
					value={Math.round(Math.abs(transform) / value)}
					max={getMaxScrollbarValue(value)}
					onChange={(e) => {
						if (carouselRef.current.isAnimationAllowed) {
							carouselRef.current.isAnimationAllowed = false;
						}
						const nextTransform = e.target.value * value;
						const nextSlide = Math.round(nextTransform / itemWidth);
						if (e.target.value === 0) {
							carouselRef.current.isAnimationAllowed = true;
						}
						carouselRef.current.setState({
							transform: -nextTransform,
							currentSlide: nextSlide,
						});
					}}
					disabled={disableScrollBar}
					className={classNames(
						styles[`custom-slider__input${scrollBarValue}`],
						styles[`custom-slider__input`]
					)}
				/>
			</div>
		);
	};

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

	return (
		<div className={styles['root-slider']}>
			<CustomLeftArrow className={styles['left-arrow-spacing']} />
			<Carousel
				className={styles['custom-carousel']}
				additionalTransform={0}
				ssr={false}
				ref={carouselRef}
				arrows={false}
				keyBoardControl={false}
				partialVisbile={false}
				customButtonGroup={
					chapters.length === 0 ? <NoChapters /> : <ChapterScrollbar />
				}
				infinite={false}
				itemClass={styles['slider-image-item']}
				containerClass={styles['carousel-container-with-scrollbar']}
				draggable={carouselDraggable}
				responsive={responsive}
			>
				{cardsToShow()}
			</Carousel>
			<CustomRightArrow className={styles['right-arrow-spacing']} />
		</div>
	);
};

export default CustomSlider;
