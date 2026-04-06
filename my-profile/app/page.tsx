import React from 'react';
import { Globe, Mail, Code, Terminal, Zap, ArrowRight, GitBranch } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen font-sans selection:bg-pink-400 selection:text-black overflow-x-hidden">
      {/* Header/Nav */}
      <nav className="p-6 md:p-8 flex justify-between items-center border-b-4 border-black bg-white sticky top-0 z-50">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase shrink-0">류찬휘</h1>
        <div className="hidden md:flex gap-4">
          <a href="#about" className="px-4 py-2 font-bold text-lg border-2 border-transparent hover:border-black transition-colors rounded-none">Intro</a>
          <a href="#skills" className="px-4 py-2 font-bold text-lg border-2 border-transparent hover:border-black transition-colors rounded-none">Skills</a>
          <a href="#contact" className="px-4 py-2 font-bold text-lg border-2 border-transparent hover:border-black transition-colors rounded-none">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-16 pb-24 md:pt-32 md:pb-40 px-6 md:px-12 flex flex-col items-start max-w-7xl mx-auto relative">
        <div className="inline-block px-4 py-2 bg-yellow-400 font-black text-lg border-4 border-black shadow-[4px_4px_0_0_#000] mb-8 lg:mb-12 rotate-[-3deg] hover:rotate-0 transition-transform">
          안녕하세요! 👋
        </div>
        <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter mb-8 md:mb-12">
          Vibe<br className="hidden md:block"/> Coding
          <br className="block md:hidden"/>
          <span className="text-pink-500">.</span>
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold max-w-3xl text-gray-900 mb-12 leading-relaxed border-l-8 border-cyan-400 pl-6 lg:pl-10">
          바이브 코딩을 전문적으로 배우고 있는 대학생, 류찬휘입니다. 직관적이고 감각적인 사용자 경험을 만듭니다.
        </p>

        <a href="#contact" className="group flex items-center gap-4 bg-purple-500 text-white px-8 py-5 text-xl lg:text-2xl font-black border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all">
          함께 작업하기 <ArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
        </a>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 md:py-32 px-6 md:px-12 border-t-4 border-black bg-[#A5F3FC]"> {/* cyan-200 */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-6xl font-black mb-12 md:mb-20 inline-block bg-white px-8 py-4 border-4 border-black shadow-[8px_8px_0_0_#000] rotate-1">
            TECH STACK
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Skill Card 1 */}
            <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_#000] transition-all">
              <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center border-4 border-black mb-8 shadow-[4px_4px_0_0_#000]">
                <Code size={32} strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl md:text-3xl font-black mb-4 uppercase">Next.js</h4>
              <p className="font-bold text-lg leading-relaxed text-gray-800">
                App Router 기반의 모던 프론트엔드 환경을 구축하고 재사용성이 높은 리액트 컴포넌트를 설계합니다.
              </p>
            </div>

            {/* Skill Card 2 */}
            <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_#000] transition-all">
              <div className="w-16 h-16 rounded-full bg-[#FCE7F3] flex items-center justify-center border-4 border-black mb-8 shadow-[4px_4px_0_0_#000]">
                <Zap size={32} strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl md:text-3xl font-black mb-4 uppercase">Tailwind CSS</h4>
              <p className="font-bold text-lg leading-relaxed text-gray-800">
                유틸리티 클래스를 활용한 빠른 컴포넌트 스타일링과 완벽한 반응형 뷰를 구현합니다.
              </p>
            </div>

            {/* Skill Card 3 */}
            <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0_0_#000] transition-all">
              <div className="w-16 h-16 rounded-full bg-[#FEF08A] flex items-center justify-center border-4 border-black mb-8 shadow-[4px_4px_0_0_#000]">
                <Terminal size={32} strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl md:text-3xl font-black mb-4 uppercase">Vibe Coding</h4>
              <p className="font-bold text-lg leading-relaxed text-gray-800">
                AI 도구와 함께 페어 프로그래밍하여 빠르고 감각적으로 최고의 디자인 프로덕트를 완성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="border-t-4 border-b-4 border-black bg-[#F472B6] py-6 md:py-8 overflow-hidden">
        <div className="flex whitespace-nowrap gap-12 animate-[marquee_20s_linear_infinite]">
          {Array(8).fill(null).map((_, i) => (
             <span key={i} className="text-4xl md:text-6xl font-black uppercase text-black inline-block tracking-widest">
               BUILD AWESOME SH*T ✨
             </span>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-12 bg-white flex flex-col items-center justify-center text-center">
        <h3 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 uppercase text-center bg-black text-white px-8 py-4 -rotate-2">
          GET IN TOUCH
        </h3>
        <p className="text-xl md:text-3xl font-bold mb-16 max-w-2xl leading-relaxed">
          언제든 연락주세요.<br className="md:hidden" /> 새로운 프로젝트, 재미있는 크리에이티브 아이디어를 환영합니다.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 md:gap-8 w-full max-w-4xl">
          <a href="#" className="flex-1 flex justify-center items-center gap-3 bg-[#FBBF24] px-6 py-6 border-4 border-black font-black text-2xl shadow-[8px_8px_0_0_#000] hover:bg-[#F59E0B] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all">
            <Mail size={32} /> Email
          </a>
          <a href="#" className="flex-1 flex justify-center items-center gap-3 bg-[#22D3EE] px-6 py-6 border-4 border-black font-black text-2xl shadow-[8px_8px_0_0_#000] hover:bg-[#06B6D4] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all">
            <GitBranch size={32} /> GitHub
          </a>
          <a href="#" className="flex-1 flex justify-center items-center gap-3 bg-[#C084FC] px-6 py-6 border-4 border-black font-black text-2xl shadow-[8px_8px_0_0_#000] hover:bg-[#A855F7] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all">
            <Globe size={32} /> Resume
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-black text-white p-8 md:p-12 text-center text-lg md:text-xl font-bold flex flex-col sm:flex-row justify-between items-center max-w-none">
        <p className="mb-4 sm:mb-0">© 2026 RYU CHANWHEE. ALL RIGHTS RESERVED.</p>
        <p className="text-[#F472B6]">BUILT WITH VIBE ✨</p>
      </footer>

      {/* Keyframes inject */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}
