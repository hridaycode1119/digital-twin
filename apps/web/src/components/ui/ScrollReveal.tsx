"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  staggerChildren?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.55,
  className = "",
  staggerChildren,
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 32, opacity: 0 };
      case "down":
        return { y: -32, opacity: 0 };
      case "left":
        return { x: 32, opacity: 0 };
      case "right":
        return { x: -32, opacity: 0 };
      case "none":
        return { opacity: 0 };
      default:
        return { y: 32, opacity: 0 };
    }
  };

  const containerVariants = {
    hidden: getInitialPosition(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier smooth ease
        when: "beforeChildren",
        staggerChildren: staggerChildren || 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionChild: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};
