import React, {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useCallback
} from "react";
import { GiFilmStrip, GiStack } from "react-icons/gi";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import Draggable from "react-draggable";
import TimeIndicator from "./TimeIndicator";

import cx from "classnames";
import styles from "./Timeline.module.scss";

const Timeline = ({
  videoBoxRef,
  timerDivWidth,
  chapterTimelineRef,
  videoTimelineRef,
  deltaPosition,
  setDeltaPosition,
  videoLength,
  timelineIndicatorRef,
  scenes,
  dispatchScene
}) => {
  const [selectedScenes, setSelectedScenes] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);

  const [markInChapters, setMarkInChapters] = useState([]);

  const deleteScene = () => {
    dispatchScene({ type: "delete", deleteIdx: selectedScenes });
    setSelectedScenes([]);
  };

  const deleteChapter = () => {
    // dispatchChapter({ type: "delete", deleteIdx: selectedChapters });
    setMarkInChapters(prevState => {
      const tmp = prevState.filter((val, idx) => {
        return !selectedChapters.includes(idx);
      });

      return [...tmp];
    });
    setSelectedChapters([]);
  };

  const createScene = () => {
    // create two objects to hold stick's position
    const scene = {
      start: { x: deltaPosition.x, y: 0 },
      end: { x: deltaPosition.x + 20, y: 0 }
    };

    dispatchScene({ sceneIdx: -1, scene });
  };

  const createChapterNew = () => {
    // Verify if the main marker is in a scene
    if (
      !scenes.some(el => {
        return deltaPosition.x >= el.start.x && deltaPosition.x <= el.end.x;
      })
    ) {
      alert("É necessário criar o capítulo em uma cena");
      return;
    }

    setMarkInChapters(prevState => {
      let tmpMarkInChapter = [...prevState];

      tmpMarkInChapter.push(deltaPosition.x);
      tmpMarkInChapter.sort((a, b) => a - b);

      return [...tmpMarkInChapter];
    });
  };

  const renderChapterNew = useMemo(
    () =>
      markInChapters.map((markIn, idx) => {
        // check if it is between chapters
        if (markInChapters[idx - 1] && markInChapters[idx + 1]) {
        }

        // check if it is the first chapter
        if (!markInChapters[idx - 1] && !markInChapters[idx + 1]) {
        }

        // check if it is the last chapter
        if (!markInChapters[idx + 1]) {
        }

        const endSceneX = Math.max.apply(
          Math,
          scenes.map(function(scene) {
            return scene.end.x;
          })
        );

        const endTag = (
          <div
            className={styles["chapter-limiter"]}
            style={{
              marginLeft: markInChapters[idx + 1]
                ? markInChapters[idx + 1]
                : endSceneX
            }}
          ></div>
        );

        const startTag = (
          <div
            className={styles["chapter-limiter"]}
            style={{ marginLeft: markIn }}
          ></div>
        );

        const chapterContent = (
          <div
            className={styles["scene-content"]}
            style={{
              marginLeft: markIn + 4 + "px", // 4 is the scene-limiter width
              width: markInChapters[idx + 1]
                ? markInChapters[idx + 1] - markIn + "px"
                : endSceneX - markIn + "px",
              backgroundColor: selectedChapters.includes(idx)
                ? "#80b9e7"
                : "#cfcdcd"
            }}
            onClick={() => {
              setSelectedChapters(prevState => {
                const tmpSelectedChapters = [...prevState];
                if (tmpSelectedChapters.indexOf(idx) !== -1) {
                  tmpSelectedChapters.splice(
                    tmpSelectedChapters.indexOf(idx),
                    1
                  );
                } else {
                  tmpSelectedChapters.push(idx);
                }
                return [...tmpSelectedChapters];
              });
            }}
          >
            Capítulo {idx + 1}
          </div>
        );

        return (
          <>
            {startTag}
            {chapterContent}
            {endTag}
          </>
        );
      }),
    [markInChapters, scenes, selectedChapters]
  );

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;

    setDeltaPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY
    });
  };

  const renderScene = useMemo(
    () =>
      scenes.map((scene, idx) => {
        console.log("asdkakda");
        const sceneStartBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
            position={scenes[idx].start}
            onDrag={(e, ui) => {
              // ve qual pauzinho tu tá usando
              const scene = {
                start: { x: ui.x, y: 0 },
                end: scenes[idx].end
              };
              dispatchScene({ sceneIdx: idx, scene });
            }}
          >
            <div
              className={cx(
                "handle",
                styles["scene-limiter"],
                styles["scene-limiter---start"]
              )}
            ></div>
          </Draggable>
        );

        const sceneEndBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
            position={scenes[idx].end}
            onDrag={(e, ui) => {
              // ve qual pauzinho tu tá usando
              const scene = {
                start: scenes[idx].start,
                end: { x: ui.x, y: 0 }
              };
              dispatchScene({ sceneIdx: idx, scene });
            }}
          >
            <div
              className={cx(
                "handle",
                styles["scene-limiter"],
                styles["scene-limiter---end"]
              )}
            ></div>
          </Draggable>
        );

        const centerDiv = (
          <div
            className={styles["scene-content"]}
            style={{
              marginLeft: scenes[idx].start.x + 4 + "px", // 7 is the scene-limiter width
              width:
                scenes[idx].end.x -
                scenes[idx].start.x +
                // + 20 bcos of the second scene's default position
                "px",
              backgroundColor: selectedScenes.includes(idx)
                ? "#80b9e7"
                : "#cfcdcd"
            }}
            onClick={() => {
              setSelectedScenes(prevState => {
                const tmpSelectedScenes = [...prevState];
                if (tmpSelectedScenes.indexOf(idx) !== -1) {
                  tmpSelectedScenes.splice(tmpSelectedScenes.indexOf(idx), 1);
                } else {
                  tmpSelectedScenes.push(idx);
                }
                return [...tmpSelectedScenes];
              });
            }}
          >
            Cena {idx + 1}
          </div>
        );

        return (
          <>
            {sceneStartBar}
            {centerDiv}
            {sceneEndBar}
          </>
        );
      }),
    [scenes, dispatchScene, selectedScenes]
  );

  return (
    <div className={styles["timeline__wrapper"]}>
      <div className={styles["buttonsWrapper"]}>
        <div className={styles["blackbox"]} />

        <div className={styles["btnContainer"]} ref={videoBoxRef}>
          <div className={styles["btnContainer__left"]}>
            <GiFilmStrip className={styles["btnContainer__icon"]} />
            <span className={styles["btnContainer__text"]}>Vídeo</span>
          </div>

          <div className={styles["btnContainer__right"]}>
            <FaPlusSquare
              className={styles["btnContainer__button"]}
              onClick={createScene}
            />
            <FaMinusSquare
              className={styles["btnContainer__button"]}
              onClick={deleteScene}
            />
          </div>
        </div>

        <div className={styles["btnContainer"]} style={{}}>
          <div className={styles["btnContainer__left"]}>
            <GiStack className={styles["btnContainer__icon"]} />
            <span className={styles["btnContainer__text--smallMargin"]}>
              Capítulos
            </span>
          </div>

          <div className={styles["btnContainer__right"]}>
            <FaPlusSquare
              className={styles["btnContainer__button"]}
              onClick={createChapterNew}
            />
            <FaMinusSquare
              className={styles["btnContainer__button"]}
              onClick={deleteChapter}
            />
          </div>
        </div>
      </div>

      <div className={styles["timeline"]} ref={videoTimelineRef}>
        <div
          style={{
            width: timerDivWidth + 34 + "px"
          }}
          className={styles["timeline__video-invisible"]}
        >
          <TimeIndicator
            timelineIndicatorRef={timelineIndicatorRef}
            videoLength={videoLength}
          />

          <div
            className={cx(
              styles["timeline__video"],
              styles["timeline__content"]
            )}
          >
            {renderScene}
          </div>

          <div
            className={cx(styles["timeline__content"])}
            ref={chapterTimelineRef}
          >
            {renderChapterNew}
          </div>
        </div>

        <Draggable
          axis="x"
          handle=".handle"
          onDrag={handleDrag}
          bounds=".timeline__video-invisible"
          grid={[10, 0]}
        >
          <div className={cx("handle", styles["stick"])}></div>
        </Draggable>
      </div>
    </div>
  );
};

export default Timeline;