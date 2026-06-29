export const Pin = () => (<svg className="pin" viewBox="0 0 24 24"><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
export const Chev = () => (<svg className="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>);
export const Arrow = () => (<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
// Sugardating logo 主标记 — 衬线斜体 S monogram(轻奢、艺术感)
// 用 <text> 而不是 path,系统 serif 兜底,避免依赖外部字体
export const Spark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <text
      x="12" y="18.2"
      textAnchor="middle"
      fontFamily='"Cormorant Garamond","Playfair Display",Didot,Georgia,"Times New Roman",serif'
      fontSize="20"
      fontWeight="500"
      fontStyle="italic"
    >S</text>
  </svg>
);
export const Tick = () => (<svg className="tick" viewBox="0 0 24 24"><path d="M12 2l2.4 1.8 3-.2 1 2.8 2.6 1.5-.6 3 .6 3-2.6 1.5-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16.3l.6-3L3 10.3l2.6-1.5 1-2.8 3 .2z" /><path d="M8.5 12.2l2.3 2.3 4.5-4.7" stroke="#fff" strokeWidth="2" fill="none" /></svg>);
