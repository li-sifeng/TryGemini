import React, { useEffect, useRef } from 'react';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ formula, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      // Clean previous content if needed, though MathJax usually handles replacement
      containerRef.current.innerHTML = block ? `\\[${formula}\\]` : `\\(${formula}\\)`;
      window.MathJax.typesetPromise?.([containerRef.current]).catch((err: any) => console.error(err));
    }
  }, [formula, block]);

  return <span ref={containerRef} className="text-slate-800 font-serif" />;
};

declare global {
  interface Window {
    MathJax: any;
  }
}