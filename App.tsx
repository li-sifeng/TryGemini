import React from 'react';
import { ButterflyVisualizer } from './components/ButterflyVisualizer';
import { ChatInterface } from './components/ChatInterface';
import { MathFormula } from './components/MathFormula';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            蝴蝶定理
          </span> 
          交互演示
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          探索引人入胜的平面几何之美。拖动滑块，观察动态，利用 AI 助教深入理解证明过程。
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visualization & Theory */}
        <div className="lg:col-span-7 space-y-8">
          {/* Visualizer Card */}
          <section>
            <ButterflyVisualizer />
          </section>

          {/* Theory Card */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">定理内容</h2>
            <div className="prose prose-slate max-w-none text-slate-700">
              <p className="mb-4">
                设 $M$ 是圆的一条弦 $PQ$ 的中点，过 $M$ 作圆的两条弦 $AB$ 和 $CD$，
                连接 $AD$ 和 $BC$，分别交 $PQ$ 于点 $X$ 和 $Y$。
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
                <p className="font-bold text-blue-900">
                  结论：$M$ 是线段 $XY$ 的中点，即 <MathFormula formula="XM = MY" />。
                </p>
              </div>
              <p className="text-sm text-slate-500">
                注：该定理得名于图形中两个连接的三角形（$\triangle ADM$ 和 $\triangle BCM$ 或其变体）构成的形状酷似一只蝴蝶。
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: AI Chat Assistant */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-8">
             <ChatInterface />
             
             {/* Hint Box */}
             <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <h4 className="font-bold flex items-center gap-1 mb-1">
                   💡 尝试问助教：
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-1">
                   <li>"请给我一个蝴蝶定理的初等几何证明。"</li>
                   <li>"如果M不是中点，这个结论还成立吗？"</li>
                   <li>"这个定理在射影几何中有什么意义？"</li>
                </ul>
             </div>
          </div>
        </div>

      </main>

      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-400 text-sm pb-8">
        <p>Interactive Butterfly Theorem © 2024</p>
      </footer>
    </div>
  );
};

export default App;