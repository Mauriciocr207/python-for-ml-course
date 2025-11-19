import { useEffect } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { LuBrainCircuit } from "react-icons/lu";

gsap.registerPlugin(MotionPathPlugin);

// type AnimationProps = {
//   pathEl: SVGPathElement;
//   circleEl: SVGCircleElement;
//   maskEl: SVGCircleElement;
//   radialEl: SVGRadialGradientElement;
// };

const paths = [
  "M843.505 284.659L752.638 284.659C718.596 284.659 684.866 280.049 653.251 271.077L598.822 255.629L0.675021 1.00011",
  "M843.505 298.181L724.342 297.36C708.881 297.36 693.45 296.409 678.22 294.518L598.822 284.659C592.82 284.659 200.538 190.002 0.675028 164.892",
  "M843.505 311.703L701.108 310.061L598.822 305.136L0.675049 256.071",
  "M843.505 325.224L598.822 326.002L0.675049 321.858",
  "M843.505 338.746L701.108 340.388L598.822 345.442L0.675038 387.646",
  "M843.505 352.268L724.342 353.088C708.881 353.088 693.45 354.039 678.22 355.93L598.822 365.789L0.675067 478.825",
  "M843.505 365.789L752.638 365.789C718.596 365.789 684.866 370.399 653.251 379.372L598.822 394.82L0.675049 642.717",
];

const dotColors = ["#9fe6fd", "#fdefab", "#fd3e00", "#13B351", "#BD34FE"];
const getRandomColor = () =>
  dotColors[Math.floor(Math.random() * dotColors.length)];

export default function Animation() {
//   const onUpdate = ({
//     latest,
//     pathEl,
//     circleEl,
//     maskEl,
//     radialEl,
//   }: { latest: number } & AnimationProps) => {
//     const p = pathEl.getPointAtLength(latest);
//     circleEl.setAttribute("cx", p.x.toString());
//     circleEl.setAttribute("cy", p.y.toString());
//     maskEl.setAttribute("cx", p.x.toString());
//     maskEl.setAttribute("cy", p.y.toString());
//     radialEl.setAttribute("cx", p.x.toString());
//     radialEl.setAttribute("cy", p.y.toString());
//   };

  const getStartAnimElements = (index: number) => {
    const pathEl = document.querySelector(`#path_${index}`) as SVGPathElement;
    const circleEl = document.querySelector(
      `#circle_${index}`
    ) as SVGCircleElement;
    const maskEl = document.querySelector(
      `#mask_circle_${index}`
    ) as SVGCircleElement;
    const radialEl = document.querySelector(
      `#glow_gradient_${index}`
    ) as SVGRadialGradientElement;

    return { pathEl, circleEl, maskEl, radialEl };
  };

  useEffect(() => {
    paths.forEach((_, index) => {
      const elements = getStartAnimElements(index);

      if (!elements.pathEl) return;
      const color = getRandomColor();

      if (elements.circleEl) {
        elements.circleEl.setAttribute("fill", color);
      }
      if (elements.radialEl) {
        Array.from(elements.radialEl.children).forEach((el) =>
          el.setAttribute("stop-color", color)
        );
      }

      gsap.to(`#circle_${index}`, {
        duration: 3,
        ease: "none",
        motionPath: {
          path: `#path_${index}`,
          start: 1,
        },
      });
    });
  }, []);

  return (
    <div className="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={844}
        height={644}
        viewBox="0 0 844 644"
        fill="none"
      >
        {paths.map((path, index) => (
          <g key={path}>
            <path
              d={path}
            //   stroke="url(#base_gradient)"
              stroke="red"
              strokeWidth="1.2"
              style={{ opacity: 1 }}
            />
            <g>
              <path
                d={path}
                id={`path_${index}`}
                stroke={`url(#glow_gradient_${index})`}
                strokeWidth="1.2"
                mask={`url(#glow_mask_${index})`}
              ></path>
              <circle id={`circle_${index}`} r="2.5" />
              <defs>
                <mask id={`glow_mask_${index}`}>
                  <path d={path} fill="black"></path>
                  <circle id={`mask_circle_${index}`} r="30" fill="white" />
                </mask>
                <radialGradient
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
    </div>
  );
}
