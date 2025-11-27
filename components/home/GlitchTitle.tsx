"use client";

import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number; // ms per scramble tick
}

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export const ScrambleText = ({
  text,
  className = "",
  scrambleSpeed = 30,
}: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const iterationRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset animation when text changes
    iterationRef.current = 0;
    
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (text[index] === '\n') return '\n';
            if (index < iterationRef.current) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iterationRef.current >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
      }

      iterationRef.current += 1 / 3; // Control the speed of resolution (slower than 1 char per tick)
    }, scrambleSpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, scrambleSpeed]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

interface CyclicScrambleProps {
    words: string[];
    interval?: number;
    className?: string;
}

export const CyclicScramble = ({ words, interval = 4000, className }: CyclicScrambleProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, interval);
        return () => clearInterval(timer);
    }, [words, interval]);

    return (
        <ScrambleText 
            text={words[index]} 
            className={className} 
        />
    );
};
