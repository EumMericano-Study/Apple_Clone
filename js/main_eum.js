(() => {
  const SECTION1_OPACITY_START = 0;
  const SECTION1_OPACITY_END = 1;
  const SECTION1_TLANSLATE_Y_START = 20;
  const SECTION1_TLANSLATE_Y_END = -15;

  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;

  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

  const sceneInfo = [
    {
      index: 0,
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 N배수로 scrollHeight 설정
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        message0: document.querySelector(
          "#scroll-section-0 .main-message[data-index='0']"
        ),
        message1: document.querySelector(
          "#scroll-section-0 .main-message[data-index='1']"
        ),
        message2: document.querySelector(
          "#scroll-section-0 .main-message[data-index='2']"
        ),
        message3: document.querySelector(
          "#scroll-section-0 .main-message[data-index='3']"
        ),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        message0_opacity_in: [
          SECTION1_OPACITY_START,
          SECTION1_OPACITY_END,
          { start: 0.1, end: 0.2 },
        ],
        message0_opacity_out: [
          SECTION1_OPACITY_END,
          SECTION1_OPACITY_START,
          { start: 0.25, end: 0.3 },
        ],
        message0_translateY_in: [
          SECTION1_TLANSLATE_Y_START,
          0,
          { start: 0.1, end: 0.2 },
        ],
        message0_translateY_out: [
          0,
          SECTION1_TLANSLATE_Y_END,
          { start: 0.25, end: 0.3 },
        ],
        message1_opacity_in: [
          SECTION1_OPACITY_START,
          SECTION1_OPACITY_END,
          { start: 0.3, end: 0.4 },
        ],
        message1_opacity_out: [
          SECTION1_OPACITY_END,
          SECTION1_OPACITY_START,
          { start: 0.45, end: 0.5 },
        ],
        message1_translateY_in: [
          SECTION1_TLANSLATE_Y_START,
          0,
          { start: 0.3, end: 0.4 },
        ],
        message1_translateY_out: [
          0,
          SECTION1_TLANSLATE_Y_END,
          { start: 0.45, end: 0.5 },
        ],
        message2_opacity_in: [
          SECTION1_OPACITY_START,
          SECTION1_OPACITY_END,
          { start: 0.5, end: 0.6 },
        ],
        message2_opacity_out: [
          SECTION1_OPACITY_END,
          SECTION1_OPACITY_START,
          { start: 0.65, end: 0.7 },
        ],
        message2_translateY_in: [
          SECTION1_TLANSLATE_Y_START,
          0,
          { start: 0.5, end: 0.6 },
        ],
        message2_translateY_out: [
          0,
          SECTION1_TLANSLATE_Y_END,
          { start: 0.65, end: 0.7 },
        ],
        message3_opacity_in: [
          SECTION1_OPACITY_START,
          SECTION1_OPACITY_END,
          { start: 0.7, end: 0.8 },
        ],
        message3_translateY_in: [
          SECTION1_TLANSLATE_Y_START,
          0,
          { start: 0.7, end: 0.8 },
        ],
        message3_opacity_out: [
          SECTION1_OPACITY_END,
          SECTION1_OPACITY_START,
          { start: 0.85, end: 0.9 },
        ],
        message3_translateY_out: [
          0,
          SECTION1_TLANSLATE_Y_END,
          { start: 0.85, end: 0.9 },
        ],
      },
    },
    {
      index: 1,
      type: "normal",
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      index: 2,
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        message0: document.querySelector(
          "#scroll-section-2 .main-message[data-index='0']"
        ),
        message1: document.querySelector(
          "#scroll-section-2 .desc-message[data-index='1']"
        ),
        pin1: document.querySelector(
          "#scroll-section-2 .desc-message[data-index='1'] .pin"
        ),
        message2: document.querySelector(
          "#scroll-section-2 .desc-message[data-index='2']"
        ),
        pin2: document.querySelector(
          "#scroll-section-2 .desc-message[data-index='2'] .pin"
        ),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 960,
        imageSequence: [0, 959],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        message0_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        message1_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        message2_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        message0_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        message1_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        message2_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        message0_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
        message1_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
        message2_translateY_out: [0, -20, { start: 0.95, end: 1 }],
        message0_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        message1_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        message2_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        pin1_scaleY: [50, 100, { start: 0.5, end: 0.55 }],
        pin2_scaleY: [50, 100, { start: 0.72, end: 0.77 }],
      },
    },
    {
      index: 3,
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector(
          "#scroll-section-3 .canvas-caption"
        ),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        imagesPath: [
          "./images/blend-image-1.jpg",
          "./images/blend-image-2.jpg",
        ],
        images: [],
      },
      values: {
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
        rectStartY: 0,
      },
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      }
      if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function CalcMeanValue(a, b) {
    return (a + b) / 2;
  }
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        // let sequence = Math.round(
        //     calcValues(values.imageSequence, currentYOffset)
        // );
        // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        objs.canvas.style.opacity = calcValues(
          values.canvas_opacity,
          currentYOffset
        );
        if (
          scrollRatio <=
          CalcMeanValue(
            values.message0_opacity_in[2].end,
            values.message0_opacity_out[2].end
          )
        ) {
          objs.message0.style.opacity = calcValues(
            values.message0_opacity_in,
            currentYOffset
          );
          objs.message0.style.transform = `translateY(${calcValues(
            values.message0_translateY_in,
            currentYOffset
          )}%)`;
        } else {
          objs.message0.style.opacity = calcValues(
            values.message0_opacity_out,
            currentYOffset
          );
          objs.message0.style.transform = `translateY(${calcValues(
            values.message0_translateY_out,
            currentYOffset
          )}%)`;
        }

        if (
          scrollRatio <=
          CalcMeanValue(
            values.message1_opacity_in[2].end,
            values.message1_opacity_out[2].end
          )
        ) {
          objs.message1.style.opacity = calcValues(
            values.message1_opacity_in,
            currentYOffset
          );
          objs.message1.style.transform = `translateY(${calcValues(
            values.message1_translateY_in,
            currentYOffset
          )}%)`;
        } else {
          objs.message1.style.opacity = calcValues(
            values.message1_opacity_out,
            currentYOffset
          );
          objs.message1.style.transform = `translateY(${calcValues(
            values.message1_translateY_out,
            currentYOffset
          )}%)`;
        }
        if (
          scrollRatio <=
          CalcMeanValue(
            values.message2_opacity_in[2].end,
            values.message2_opacity_out[2].end
          )
        ) {
          objs.message2.style.opacity = calcValues(
            values.message2_opacity_in,
            currentYOffset
          );
          objs.message2.style.transform = `translateY(${calcValues(
            values.message2_translateY_in,
            currentYOffset
          )}%)`;
        } else {
          objs.message2.style.opacity = calcValues(
            values.message2_opacity_out,
            currentYOffset
          );
          objs.message2.style.transform = `translateY(${calcValues(
            values.message2_translateY_out,
            currentYOffset
          )}%)`;
        }
        if (
          scrollRatio <=
          CalcMeanValue(
            values.message3_opacity_in[2].end,
            values.message3_opacity_out[2].end
          )
        ) {
          objs.message3.style.opacity = calcValues(
            values.message3_opacity_in,
            currentYOffset
          );
          objs.message3.style.transform = `translateY(${calcValues(
            values.message3_translateY_in,
            currentYOffset
          )}%)`;
        } else {
          objs.message3.style.opacity = calcValues(
            values.message3_opacity_out,
            currentYOffset
          );
          objs.message3.style.transform = `translateY(${calcValues(
            values.message3_translateY_out,
            currentYOffset
          )}%)`;
        }

        break;
      case 2:
        if (scrollRatio <= 0.5) {
          objs.canvas.style.opacity = calcValues(
            values.canvas_opacity_in,
            currentYOffset
          );
        } else {
          objs.canvas.style.opacity = calcValues(
            values.canvas_opacity_out,
            currentYOffset
          );
        }
        if (
          scrollRatio <=
          CalcMeanValue(
            values.message0_opacity_in[2].end,
            values.message0_opacity_out[2].end
          )
        ) {
          objs.message0.style.opacity = calcValues(
            values.message0_opacity_in,
            currentYOffset
          );
          objs.message0.style.transform = `translateY(${calcValues(
            values.message0_translateY_in,
            currentYOffset
          )}%)`;
        } else {
          objs.message0.style.opacity = calcValues(
            values.message0_opacity_out,
            currentYOffset
          );
          objs.message0.style.transform = `translateY(${calcValues(
            values.message0_translateY_out,
            currentYOffset
          )}%)`;
        }
        if (
          scrollRatio <=
          CalcMeanValue(
            values.message1_opacity_in[2].end,
            values.message1_opacity_out[2].end
          )
        ) {
          objs.message1.style.opacity = calcValues(
            values.message1_opacity_in,
            currentYOffset
          );
          objs.message1.style.transform = `translateY(${calcValues(
            values.message1_translateY_in,
            currentYOffset
          )}%)`;
          objs.pin1.style.transform = `scaleY(${calcValues(
            values.pin1_scaleY,
            currentYOffset
          )}%)`;
        } else {
          objs.message1.style.opacity = calcValues(
            values.message1_opacity_out,
            currentYOffset
          );
          objs.message1.style.transform = `translateY(${calcValues(
            values.message1_translateY_out,
            currentYOffset
          )}%)`;
          objs.pin1.style.transform = `scaleY(${calcValues(
            values.pin1_scaleY,
            currentYOffset
          )}%)`;
        }

        if (
          scrollRatio <=
          CalcMeanValue(
            values.message2_opacity_in[2].end,
            values.message2_opacity_out[2].end
          )
        ) {
          objs.message2.style.opacity = calcValues(
            values.message2_opacity_in,
            currentYOffset
          );
          // 3d가 붙은 친구들은 하드웨어 보정이 된다 (퍼포먼스가 좋다)
          objs.message2.style.transform = `translate3d(0,${calcValues(
            values.message2_translateY_in,
            currentYOffset
          )}%, 0)`;
          objs.pin2.style.transform = `scaleY(${calcValues(
            values.pin2_scaleY,
            currentYOffset
          )}%)`;
        } else {
          objs.message2.style.opacity = calcValues(
            values.message2_opacity_out,
            currentYOffset
          );
          objs.message2.style.transform = `translate3d(0,${calcValues(
            values.message2_translateY_out,
            currentYOffset
          )}%,0)`;
          objs.pin2.style.transform = `scaleY(${calcValues(
            values.pin2_scaleY,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;

          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = widthRatio;
          }

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = "white";
          objs.context.drawImage(objs.images[0], 0, 0);

          const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
          const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;

          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] =
            values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            whiteRectWidth,
            objs.canvas.height
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            whiteRectWidth,
            objs.canvas.height
          );
        }

        break;
      case 3:
        let step = 0;
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;

        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = "white";
        objs.context.drawImage(objs.images[0], 0, 0);

        const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        if (!values.rectStartY) {
          //   values.rectStartY = objs.canvas.getBoundingClientRect().top;
          values.rectStartY =
            objs.canvas.offsetTop +
            (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }
        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[0] =
          values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, currentYOffset)),
          0,
          whiteRectWidth,
          objs.canvas.height
        );
        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, currentYOffset)),
          0,
          whiteRectWidth,
          objs.canvas.height
        );

        if (scrollRatio < values.rect1X[2].end) {
          // 첫 canvas가 꽉 차기 전
          step = 1;
          objs.canvas.classList.remove("sticky");
        } else {
          // 첫 canvas가 꽉 찬 후
          step = 2;
          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end + 0.05;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.15;

          const blendHeight = calcValues(values.blendHeight, currentYOffset);

          objs.context.drawImage(
            objs.images[1],
            0,
            objs.canvas.height - blendHeight,
            objs.canvas.width,
            blendHeight,
            0,
            objs.canvas.height - blendHeight,
            objs.canvas.width,
            blendHeight
          );

          objs.canvas.classList.add("sticky");
          objs.canvas.style.top = `${
            -(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2
          }px`;

          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            values.canvas_scale[1] =
              document.body.offsetWidth / (1.5 * objs.canvas.width);
            values.canvas_scale[2].start = values.blendHeight[2].end + 0.05;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.15;

            objs.canvas.style.transform = `scale(${calcValues(
              values.canvas_scale,
              currentYOffset
            )})`;
            objs.canvas.style.marginTop = `0`;
          }
          if (
            values.canvas_scale[2].end > 0 &&
            scrollRatio > values.canvas_scale[2].end
          ) {
            objs.canvas.classList.remove("sticky");
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
            values.canvasCaption_opacity[2].end =
              values.canvasCaption_opacity[2].start + 0.1;
            values.canvasCaption_translateY[2].start =
              values.canvasCaption_opacity[2].start;
            values.canvasCaption_translateY[2].end =
              values.canvasCaption_opacity[2].end;

            objs.canvasCaption.style.opacity = calcValues(
              values.canvasCaption_opacity,
              currentYOffset
            );

            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(
              values.canvasCaption_translateY,
              currentYOffset
            )}%, 0)`;
          }
        }
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (
      delayedYOffset <
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      document.body.classList.remove("scroll-effect-end");
    }
    if (
      delayedYOffset >
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      if (currentScene === sceneInfo.length - 1) return;
      enterNewScene = true;
      if (currentScene < sceneInfo.length - 1)
        document.body.classList.add("scroll-effect-end");
      if (currentScene < sceneInfo.length - 1) currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (delayedYOffset < prevScrollHeight) {
      if (currentScene === 0) return;
      enterNewScene = true;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const values = sceneInfo[currentScene].values;
        const objs = sceneInfo[currentScene].objs;
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        if (objs.videoImages[sequence]) {
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener("load", () => {
    document.body.classList.remove("before-load");
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    let tempYOffset = yOffset;
    let tempScrollCount = 0;

    if (yOffset > 20) {
      let SIId = setInterval(() => {
        window.scrollTo(0, tempYOffset);
        tempYOffset += 3;

        if (tempScrollCount > 10) {
          clearInterval(SIId);
        }
        tempScrollCount++;
      }, 20);
    }
    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      checkMenu();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        window.location.reload();
      }
    });

    window.addEventListener("orientationchange", () => {
      scrollTo(0, 0);
      setTimeout(() => {
        setLayout();
      }, 200);
    });

    document
      .querySelector(".loading")
      .addEventListener("transitionend", (event) => {
        document.body.removeChild(event.currentTarget);
      });
  });
  setCanvasImages();
})();
