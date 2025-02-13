import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./Card.css";

/**
 * credit to: https://codesandbox.io/p/sandbox/framer-motion-image-gallery-pqvx3?file=%2Fsrc%2FExample.tsx%3A28%2C1-37%2C3&from-embed
 *
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  initial: {
    scale: 0,
  },
  animate: ({ position }) => ({
    scale: 1 + position * 0.05,
    top: position * 20,
  }),
  exit: ({ direction }) => ({
    x: direction * 600,
    opacity: 0,
    transition: { duration: 0.5 },
    zIndex: 100,
  }),
};

const Card = React.forwardRef(function Card(
  { isActive, isVisible, swipeCard, position, direction, footer },
  ref
) {
  const onDragEnd = (e, { offset, velocity }) => {
    const power = swipePower(offset.x, velocity.x);
    if (power < -swipeConfidenceThreshold) {
      swipeCard(-1);
    } else if (power > swipeConfidenceThreshold) {
      swipeCard(1);
    }
  };

  const [constraints, setConstraints] = useState(null);
  useEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      const padding = 50;

      setConstraints({
        left: -width / 2 + padding,
        right: width / 2 - padding,
        top: -height / 2 + padding,
        bottom: height / 2 - padding,
      });
    }
  }, [ref]);

  return (
    <AnimatePresence custom={{ position, direction }} mode="wait">
      {isVisible && (
        <motion.div
          style={{ zIndex: position }}
          custom={{ position, direction }}
          initial="initial"
          animate="animate"
          exit="exit"
          drag={isActive}
          onDragEnd={onDragEnd}
          dragConstraints={constraints}
          dragElastic={0.3}
          dragSnapToOrigin
          className="card-container"
          variants={variants}
        >
          <div className="image-container">
            <div className="image-holder">
              <img
                draggable={false}
                src={require("../assets/images/pic1.jpg")}
                alt="img"
              ></img>
            </div>
          </div>
          <div className="info-container">
            <div className="footer">{footer}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default Card;
