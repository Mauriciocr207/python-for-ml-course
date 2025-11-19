import { animate, type AnimationSequence } from "motion";
import { useEffect, useRef } from "react";
import { LuBrainCircuit } from "react-icons/lu";

type SVGElement = SVGPathElement | SVGCircleElement | SVGRadialGradientElement;

type AnimationProps = {
  pathEl: SVGPathElement;
  circleEl: SVGCircleElement;
  maskEl: SVGCircleElement;
  radialEl: SVGRadialGradientElement;
};

const paths = [
  "M843.505 284.659L752.638 284.659C718.596 284.659 684.866 280.049 653.251 271.077L598.822 255.629L0.675021 1.00011",
    // "M843.505 298.181L724.342 297.36C708.881 297.36 693.45 296.409 678.22 294.518L598.822 284.659C592.82 284.659 200.538 190.002 0.675028 164.892",
    // "M843.505 311.703L701.108 310.061L598.822 305.136L0.675049 256.071",
    // "M843.505 325.224L598.822 326.002L0.675049 321.858",
    // "M843.505 338.746L701.108 340.388L598.822 345.442L0.675038 387.646",
    // "M843.505 352.268L724.342 353.088C708.881 353.088 693.45 354.039 678.22 355.93L598.822 365.789L0.675067 478.825",
    // "M843.505 365.789L752.638 365.789C718.596 365.789 684.866 370.399 653.251 379.372L598.822 394.82L0.675049 642.717",
];

const dotColors = ["#9fe6fd", "#fdefab", "#fd3e00", "#13B351", "#BD34FE"];

const getRandomColor = () => {
  return dotColors[Math.floor(Math.random() * dotColors.length)];
};

const animationConfig = {
  enter: {
    start: 100,
    end: 100,
  },
  leave: {
    start: 100,
    end: 100,
  },
};

export default function Animation() {
  // For start animation
  const pathRefs = useRef<SVGPathElement[]>([]);
  const circleRefs = useRef<SVGCircleElement[]>([]);
  const maskRefs = useRef<SVGCircleElement[]>([]);
  const radialRefs = useRef<SVGRadialGradientElement[]>([]);

  // For end animation
  const outPathRef = useRef<SVGPathElement>(null);
  const outCircleRefs = useRef<SVGCircleElement[]>([]);
  const outMaskRefs = useRef<SVGCircleElement[]>([]);
  const outRadialRefs = useRef<SVGRadialGradientElement[]>([]);

  const onUpdate = ({
    latest,
    pathEl,
    circleEl,
    maskEl,
    radialEl,
  }: { latest: number } & AnimationProps) => {
    const p = pathEl.getPointAtLength(latest);
    circleEl.setAttribute("cx", p.x.toString());
    circleEl.setAttribute("cy", p.y.toString());
    maskEl.setAttribute("cx", p.x.toString());
    maskEl.setAttribute("cy", p.y.toString());
    radialEl.setAttribute("cx", p.x.toString());
    radialEl.setAttribute("cy", p.y.toString());
  };

  const getStartAnimElements = (index: number) => {
    const circleEl = circleRefs.current[index];
    const maskEl = maskRefs.current[index];
    const radialEl = radialRefs.current[index];
    return { circleEl, maskEl, radialEl };
  };

  const getEndAnimElements = (index: number) => {
    const circleEl = outCircleRefs.current[index];
    const maskEl = outMaskRefs.current[index];
    const radialEl = outRadialRefs.current[index];
    return { circleEl, maskEl, radialEl };
  };

  const createEnterStartAnimation = () => {
    const animations: AnimationSequence = [];
    pathRefs.current.forEach((pathEl, index) => {
      const elements = { pathEl, ...getStartAnimElements(index) };
      const color = getRandomColor();
      elements.circleEl.setAttribute("fill", color);
    //   Array.from(elements.radialEl.children).forEach((el) =>
    //     el.setAttribute("stop-color", color)
    //   );
    //   const delay = Number((Math.random() * 1.5).toFixed(2));
    //   animations.push([
    //     elements.circleEl,
    //     { opacity: [0, 1], scale: [0, 1] },
    //     {
    //       duration: 1,
    //     //   delay,
    //       at: 0,
    //     },
    //   ]);
      animations.push([
        1, 0,
        {
          duration: 3,
          //   ease: "linear",
          onUpdate: (latest) => safeOnUpdate({ progress: latest, ...elements }),
        },
      ]);
    });
    return Promise.all(animations.map((animation) => animate(...animation)));
  };

  const createEnterEndAnimation = () => {
    const animations: AnimationSequence = [];
    pathRefs.current.forEach((pathEl, index) => {
      const elements = { pathEl, ...getStartAnimElements(index) };
      const total = pathEl.getTotalLength();
      animations.push([
        total * 0.5,
        0,
        {
          duration: 1,
          onUpdate: (latest) => onUpdate({ latest, ...elements }),
          delay: 0.1,
        },
      ]);
    });
    return Promise.all(animations.map((animation) => animate(...animation)));
  };

  const createLeaveStartAnimation = () => {
    const animations: AnimationSequence = [];
    const pathEl = outPathRef.current;
    if (!pathEl) return;
    outCircleRefs.current.forEach((_, index) => {
      const elements = { pathEl, ...getEndAnimElements(index) };
      elements.circleEl.setAttribute("fill", "#BD34FE");
      Array.from(elements.radialEl.children).forEach((el) =>
        el.setAttribute("stop-color", "#BD34FE")
      );
      const total = pathEl.getTotalLength();
    //   const delay = 1;
    //   animations.push([
    //     elements.maskEl,
    //     { opacity: [0, 1] },
    //     { duration: 1, delay },
    //   ]);
    //   animations.push([
    //     elements.radialEl,
    //     { opacity: [0, 1] },
    //     { duration: 1, delay },
    //   ]);
      animations.push([
        total,
        0,
        {
          duration: 2,
          onUpdate: (latest) => onUpdate({ latest, ...elements }),
        //   delay,
        },
      ]);
    });
    return Promise.all(animations.map((animation) => animate(...animation)));
  };

  useEffect(() => {
    if (pathRefs && circleRefs) {
      (async () => {
        await createEnterStartAnimation();
        // await createEnterEndAnimation();
        // await createLeaveStartAnimation();
      })();
    }
  }, []);

  console.log(pathRefs, circleRefs, maskRefs, radialRefs);

  const proportion = 1;
  const width = 844 * proportion;
  const height = 644 * proportion;

  const createRefHandler =
    (index: number, refArray: React.RefObject<SVGElement[]>) =>
    (el: SVGElement | null) => {
      if (el) {
        refArray.current[index] = el;
      }
    };

  return (
    <div className="relative flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 844 644"
        fill="none"
      >
        {paths.map((path, index) => (
          <g key={path}>
            <path
              ref={createRefHandler(index, pathRefs)}
              d={path}
              stroke="url(#base_gradient)"
              strokeWidth="1.2"
              style={{ opacity: 0.8 }}
            />
            <g>
              <path
                d={path}
                stroke={`url(#glow_gradient_${index})`}
                strokeWidth="1.2"
                mask={`url(#glow_mask_${index})`}
              ></path>
              <circle ref={createRefHandler(index, circleRefs)} r="2.5" />
              <defs>
                <mask id={`glow_mask_${index}`}>
                  <path d={path} fill="black"></path>
                  <circle
                    ref={createRefHandler(index, maskRefs)}
                    r="30"
                    fill="white"
                  ></circle>
                </mask>
                <radialGradient
                  ref={createRefHandler(index, radialRefs)}
                  id={`glow_gradient_${index}`}
                  r="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopOpacity="0"></stop>
                </radialGradient>
              </defs>
            </g>
          </g>
        ))}
        <defs>
          <linearGradient
            id="base_gradient"
            x1="88.1032"
            y1="324.167"
            x2="843.505"
            y2="324.167"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#c6caff" stopOpacity="0" />
            <stop offset="0.2" stopColor="#c6caff" stopOpacity="0.1" />
            <stop offset="0.4" stopColor="white" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#c6caff" stopOpacity="0.2" />
            <stop offset="0.8" stopColor="#c6caff" stopOpacity="0.2" />
            <stop offset="0.9" stopColor="#c6caff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="w-8 h-8 bg-linear-to-br from-[#bd34fe] to-[#41d1ff] rounded-lg flex items-center justify-center">
        <LuBrainCircuit className="size-5" />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 844 644"
        fill="none"
      >
        <g>
          <path
            ref={outPathRef}
            d={paths[3]}
            stroke="url(#base_gradient)"
            strokeWidth="1.2"
            style={{ opacity: 0.8 }}
          />
          {Array.from({ length: 3 }).map((_, index) => (
            <g key={index}>
              <path
                d={paths[3]}
                stroke={`url(#glow_gradient__${index})`}
                strokeWidth="1.2"
                mask={`url(#glow_mask__${index})`}
              ></path>
              <circle
                ref={createRefHandler(index, outCircleRefs)}
                fill="#BD34FE"
                r="2.5"
              />
              <defs>
                <mask id={`glow_mask__${index}`}>
                  <path d={paths[3]} fill="black"></path>
                  <circle
                    ref={createRefHandler(index, outMaskRefs)}
                    r="30"
                    fill="white"
                  ></circle>
                </mask>
                <radialGradient
                  ref={createRefHandler(index, outRadialRefs)}
                  id={`glow_gradient__${index}`}
                  r="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" fill="#BD34FE" stopOpacity="0.8"></stop>
                  <stop offset="100%" fill="#BD34FE" stopOpacity="0"></stop>
                </radialGradient>
              </defs>
            </g>
          ))}
        </g>
        <defs>
          <linearGradient
            id="base_gradient"
            x1="88.1032"
            y1="324.167"
            x2="843.505"
            y2="324.167"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#c6caff" stopOpacity="0" />
            <stop offset="0.2" stopColor="#c6caff" stopOpacity="0.1" />
            <stop offset="0.4" stopColor="white" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#c6caff" stopOpacity="0.2" />
            <stop offset="0.8" stopColor="#c6caff" stopOpacity="0.2" />
            <stop offset="0.9" stopColor="#c6caff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
