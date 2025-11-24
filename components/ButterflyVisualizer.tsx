import React, { useState, useMemo } from 'react';
import { Point } from '../types';

// Geometry constants
const VIEWBOX_SIZE = 400;
const RADIUS = 160;
const CENTER = 0; // (0,0) in logic
const M_OFFSET_Y = 50; // The definition of Point M (0, 50)

// Types for internal calculation
interface IntersectionSet {
  A: Point;
  B: Point;
  C: Point;
  D: Point;
  X: Point;
  Y: Point;
  P: Point;
  Q: Point;
  M: Point;
}

export const ButterflyVisualizer: React.FC = () => {
  // Angles of the two chords passing through M
  // AB passes through M at angle1 (degrees)
  // CD passes through M at angle2 (degrees)
  const [angleAB, setAngleAB] = useState<number>(60);
  const [angleCD, setAngleCD] = useState<number>(120);

  // --- Geometry Engine ---

  // Helper: Get intersections of a line passing through M(0, mY) with angle theta and Circle(0,0,R)
  const getChordIntersections = (degrees: number, mY: number, r: number): [Point, Point] => {
    const rad = (degrees * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Line parametric: x = t * cos, y = mY + t * sin
    // Circle: x^2 + y^2 = r^2
    // (t*cos)^2 + (mY + t*sin)^2 = r^2
    // t^2(cos^2 + sin^2) + 2*t*mY*sin + mY^2 - r^2 = 0
    // t^2 + (2*mY*sin)*t + (mY^2 - r^2) = 0
    
    // Quadratic formula for t
    const a = 1;
    const b = 2 * mY * sin;
    const c = mY * mY - r * r;
    
    const delta = Math.sqrt(b * b - 4 * a * c);
    const t1 = (-b + delta) / (2 * a);
    const t2 = (-b - delta) / (2 * a);

    return [
      { x: t1 * cos, y: mY + t1 * sin },
      { x: t2 * cos, y: mY + t2 * sin },
    ];
  };

  // Helper: Get intersection of Line(P1, P2) and horizontal line y = constant
  const getIntersectionWithHorizontal = (p1: Point, p2: Point, yLine: number): Point => {
    if (Math.abs(p2.x - p1.x) < 0.001) {
       // Vertical line
       return { x: p1.x, y: yLine };
    }
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    // y - y1 = m(x - x1) -> x = (y - y1)/m + x1
    const x = (yLine - p1.y) / m + p1.x;
    return { x, y: yLine };
  };

  const geometry: IntersectionSet = useMemo(() => {
    const M: Point = { x: 0, y: M_OFFSET_Y };
    
    // Chord PQ is horizontal through M
    // Intersection with circle: x^2 + mY^2 = R^2 -> x = +/- sqrt(R^2 - mY^2)
    const halfChordPQ = Math.sqrt(RADIUS * RADIUS - M_OFFSET_Y * M_OFFSET_Y);
    const P: Point = { x: -halfChordPQ, y: M_OFFSET_Y };
    const Q: Point = { x: halfChordPQ, y: M_OFFSET_Y };

    const [A, B] = getChordIntersections(angleAB, M_OFFSET_Y, RADIUS);
    const [C, D] = getChordIntersections(angleCD, M_OFFSET_Y, RADIUS);

    // Butterfly Lines: AD and BC
    // Intersection with PQ (line y = M_OFFSET_Y)
    
    // Careful with labeling to ensure proper butterfly shape.
    // If we just take points, we might get the "hourglass" or the outer intersection.
    // The theorem usually connects endpoints on opposite sides or same sides.
    // Standard Butterfly: Chord AB, Chord CD through M. 
    // Intersection X is AD intersect PQ. Intersection Y is BC intersect PQ.
    // Note: A and B are ends of one chord. C and D are ends of another.
    // Depending on which end is which, X and Y might be outside the circle or inside.
    // To keep it "inside" (the classic butterfly look), we usually connect endpoints on same side of PQ?
    // Actually, let's stick to the formal definition:
    // Chord 1: ends A, B. Chord 2: ends C, D.
    // Let's connect A to C and B to D? Or A to D and B to C?
    // The theorem holds for both pairs (AD/BC or AC/BD).
    // Let's visualize AD and BC to match the description.
    
    const X = getIntersectionWithHorizontal(A, D, M_OFFSET_Y);
    const Y = getIntersectionWithHorizontal(B, C, M_OFFSET_Y);

    return { A, B, C, D, X, Y, P, Q, M };
  }, [angleAB, angleCD]);

  const { A, B, C, D, X, Y, P, Q, M } = geometry;

  // Formatting numbers for display
  const formatDist = (val: number) => Math.abs(val).toFixed(2);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-2xl border border-slate-200">
        <svg 
          viewBox={`${-VIEWBOX_SIZE/2} ${-VIEWBOX_SIZE/2} ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} 
          className="w-full h-auto touch-none select-none"
        >
          {/* Definitions */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Coordinate Axis (Subtle) */}
          <line x1={-190} y1={0} x2={190} y2={0} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={0} y1={-190} x2={0} y2={190} stroke="#f1f5f9" strokeWidth="1" />

          {/* Main Circle */}
          <circle cx={0} cy={0} r={RADIUS} fill="none" stroke="#334155" strokeWidth="2" />

          {/* Chord PQ */}
          <line x1={P.x} y1={-P.y} x2={Q.x} y2={-Q.y} stroke="#64748b" strokeWidth="2" />
          <text x={P.x - 15} y={-P.y + 5} className="text-xs font-bold" fill="#64748b">P</text>
          <text x={Q.x + 10} y={-Q.y + 5} className="text-xs font-bold" fill="#64748b">Q</text>

          {/* Point M */}
          <circle cx={M.x} cy={-M.y} r={4} fill="#ef4444" />
          <text x={M.x - 5} y={-M.y + 20} className="text-xs font-bold" fill="#ef4444">M</text>

          {/* Chord AB */}
          <line x1={A.x} y1={-A.y} x2={B.x} y2={-B.y} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <text x={A.x} y={-A.y - 10} className="text-xs font-bold" fill="#3b82f6">A</text>
          <text x={B.x} y={-B.y + 15} className="text-xs font-bold" fill="#3b82f6">B</text>

          {/* Chord CD */}
          <line x1={C.x} y1={-C.y} x2={D.x} y2={-D.y} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <text x={C.x} y={-C.y - 10} className="text-xs font-bold" fill="#3b82f6">C</text>
          <text x={D.x} y={-D.y + 15} className="text-xs font-bold" fill="#3b82f6">D</text>

          {/* Butterfly Wings Lines (AD and BC) */}
          <line x1={A.x} y1={-A.y} x2={D.x} y2={-D.y} stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
          <line x1={B.x} y1={-B.y} x2={C.x} y2={-C.y} stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />

          {/* Intersection Points X and Y */}
          <circle cx={X.x} cy={-X.y} r={4} fill="#8b5cf6" />
          <text x={X.x - 5} y={-X.y - 10} className="text-xs font-bold" fill="#8b5cf6">X</text>

          <circle cx={Y.x} cy={-Y.y} r={4} fill="#8b5cf6" />
          <text x={Y.x - 5} y={-Y.y - 10} className="text-xs font-bold" fill="#8b5cf6">Y</text>

          {/* Highlight Segments XM and MY to show equality */}
          <line x1={X.x} y1={-X.y} x2={M.x} y2={-M.y} stroke="#8b5cf6" strokeWidth="4" opacity="0.3" />
          <line x1={Y.x} y1={-Y.y} x2={M.x} y2={-M.y} stroke="#8b5cf6" strokeWidth="4" opacity="0.3" />

        </svg>

        {/* Controls */}
        <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-lg">
                <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        旋转弦 AB <span className="text-blue-500">({angleAB}°)</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="180" 
                        step="1"
                        value={angleAB}
                        onChange={(e) => setAngleAB(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        旋转弦 CD <span className="text-blue-500">({angleCD}°)</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="180" 
                        step="1"
                        value={angleCD}
                        onChange={(e) => setAngleCD(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>

            {/* Real-time Data Display */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase font-semibold tracking-wider">Length XM</p>
                    <p className="text-2xl font-bold text-purple-800 font-mono">{formatDist(X.x - M.x)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase font-semibold tracking-wider">Length MY</p>
                    <p className="text-2xl font-bold text-purple-800 font-mono">{formatDist(Y.x - M.x)}</p>
                </div>
            </div>
            <p className="text-center text-sm text-slate-500 italic">
                拖动滑块改变角度，观察 XM 和 MY 的长度始终保持相等。
            </p>
        </div>
      </div>
    </div>
  );
};
