(() => {
  const SECTION1_OPACITY_START = 0;
  const SECTION1_OPACITY_END = 1;
  const SECTION1_TLANSLATE_Y_START = 20;
  const SECTION1_TLANSLATE_Y_END = -15;

  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;

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
      },
      values: {
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
        message1_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        message1_opacity_out: [1, 0, { start: 0.35, end: 0.4 }],
        message1_opacity_in: [-20, 0, { start: 0.3, end: 0.4 }],
        message1_opacity_out: [0, 15, { start: 0.35, end: 0.4 }],
      },
    },
    {
      index: 1,
      type: "normal",
      heightNum: 5,
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
      },
    },
    {
      index: 3,
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

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

        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      if (currentScene === sceneInfo.length - 1) return;
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (pageYOffset < prevScrollHeight) {
      if (currentScene === 0) return;
      enterNewScene = true;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
})();
