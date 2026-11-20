/* ============================================================
   渲染引擎 · hash 路由 / 进度存储 / 正文组件渲染
   ============================================================ */
(function(){
  "use strict";
  const C = window.COURSE;
  const L = window.LESSONS || {};
  const M = window.MEDIA || {};
  const app = document.getElementById('app');
  const topbar = document.getElementById('topbar');
  const brand = document.getElementById('brand');
  const bottomnav = document.getElementById('bottomnav');
  const progressBar = document.getElementById('readprogress');
  const NS = 'zhHistory.v1';

  /* ---------- 存储 ---------- */
  function load(){
    try{ return JSON.parse(localStorage.getItem(NS)) || {done:{},fs:'fs-m',theme:'light'}; }
    catch(e){ return {done:{},fs:'fs-m',theme:'light'}; }
  }
  let S = load();
  function save(){ localStorage.setItem(NS, JSON.stringify(S)); }
  function applyPrefs(){
    document.body.classList.remove('fs-s','fs-m','fs-l','fs-xl','dark');
    document.body.classList.add(S.fs||'fs-m');
    if(S.theme==='dark') document.body.classList.add('dark');
    document.querySelectorAll('#segFont button').forEach(b=>b.classList.toggle('on',b.dataset.fs===S.fs));
    document.querySelectorAll('#segTheme button').forEach(b=>b.classList.toggle('on',b.dataset.theme===S.theme));
    document.querySelector('meta[name=theme-color]').content = S.theme==='dark'?'#161513':'#1b1a17';
  }

  /* ---------- 工具 ---------- */
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const allChapters = ()=> C.modules.flatMap(m=>m.chapters.map(c=>({...c,mod:m})));
  function findChapter(id){ return allChapters().find(c=>c.id===id); }
  function hasLesson(id){ return !!L[id]; }
  function toast(msg){
    const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
    clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),1800);
  }
  function setTopbarDark(on){ topbar.classList.toggle('on-dark',!!on); }
  function setNav(route){
    bottomnav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.dataset.nav===route));
  }
  function scrollTop(){ window.scrollTo({top:0,behavior:'instant'}); }

  /* ---------- SVG 装饰 ---------- */
  function sealSVG(){
    return `<svg class="seal" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="4" fill="none" stroke="#9c362a" stroke-width="3"/>
      <text x="32" y="27" fill="#9c362a" font-size="20" font-family="Songti SC,serif" text-anchor="middle">中国</text>
      <text x="32" y="51" fill="#9c362a" font-size="20" font-family="Songti SC,serif" text-anchor="middle">历史</text>
    </svg>`;
  }
  function mountainsSVG(){
    return `<svg class="mountains" viewBox="0 0 400 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,160 L0,110 Q40,80 70,105 Q100,70 140,100 Q180,55 220,95 Q270,40 320,88 Q360,60 400,95 L400,160 Z" fill="#0e0d0b"/>
      <path d="M0,160 L0,132 Q50,110 95,130 Q150,100 200,128 Q260,102 310,128 Q360,110 400,132 L400,160 Z" fill="#080705"/>
      <path d="M150,100 Q180,55 220,95" fill="none" stroke="rgba(178,154,99,.25)" stroke-width="1"/>
    </svg>`;
  }
  function starsSVG(){
    let pts=''; const seed=[12,30,55,88,120,150,182,210,246,280,315,340,372,25,140,300];
    seed.forEach((x,i)=>{ pts+=`<circle cx="${x}" cy="${(i*47)%150+8}" r="${i%3===0?1.3:0.8}" fill="#e8dcc0"/>`; });
    return `<svg class="stars" viewBox="0 0 400 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${pts}</svg>`;
  }

  /* ---------- 路由 ---------- */
  function parseRoute(){
    const h = location.hash.replace(/^#\/?/,'');
    if(!h) return {name:'home'};
    const p = h.split('/');
    if(p[0]==='catalog') return {name:'catalog'};
    if(p[0]==='atlas') return {name:'atlas'};
    if(p[0]==='progress') return {name:'progress'};
    if(p[0]==='module' && p[1]) return {name:'module',id:p[1]};
    if(p[0]==='chapter' && p[1]) return {name:'chapter',id:p[1]};
    return {name:'home'};
  }

  function render(){
    const r = parseRoute();
    progressBar.style.width='0';
    if(r.name==='home') renderHome();
    else if(r.name==='catalog') renderCatalog();
    else if(r.name==='module') renderModule(r.id);
    else if(r.name==='chapter') renderChapter(r.id);
    else if(r.name==='atlas') renderAtlas();
    else if(r.name==='progress') renderProgress();
    applyPrefs();
    scrollTop();
  }

  /* ---------- 首页 ---------- */
  function renderHome(){
    setTopbarDark(true); setNav('home');
    const total = allChapters().length;
    const done = Object.values(S.done).filter(Boolean).length;
    app.innerHTML = `
      <section class="hero">
        ${starsSVG()}${mountainsSVG()}
        <div class="hero-inner">
          <div class="kicker">A Digital Museum of Chinese History</div>
          <h1>中国历史</h1>
          <div class="en">The History of China</div>
          ${sealSVG()}
          <div class="rule"></div>
          <p class="tagline">${esc(C.tagline)}</p>
          <div class="meta">${esc(C.edition)} · 八大模块 · ${total} 章</div>
        </div>
        <div class="hero-foot">
          <div class="scrollcue"><span class="line"></span><span>向下 · 开启旅程</span></div>
          <a href="#/catalog" class="iconbtn" style="border-color:rgba(255,255,255,.3)">↓</a>
        </div>
      </section>

      <section class="section wrap">
        <div class="section-head">
          <span class="no">ABOUT · 关于本课程</span>
          <h2>一部演进史，<br>而不只是朝代故事</h2>
          <p class="desc">综合吕思勉《中国通史》、钱穆《国史大纲》、讲谈社《中国的历史》三套著作。以政治、经济、社会、文明的结构变化为主线，追问「为什么会这样」，而非罗列「发生了什么」。</p>
        </div>
        <div class="intro-stat">
          <div><b>8</b><span>课程模块</span></div>
          <div><b>${total}</b><span>独立章节</span></div>
          <div><b>3</b><span>核心著作</span></div>
          <div><b>${done}</b><span>已读章节</span></div>
        </div>
      </section>

      <section class="section wrap" style="padding-top:8px">
        <div class="section-head">
          <span class="no">CONTENTS · 八大模块</span>
          <h2>从文明起源<br>到现代中国</h2>
        </div>
        <div id="modlist"></div>
      </section>

      <section class="section wrap" style="text-align:center;padding-bottom:100px">
        <div style="height:1px;background:var(--line);margin-bottom:40px"></div>
        <p style="font-size:13px;color:var(--ink-soft);line-height:2">
          史实、史料记载、历史解释与推测分而述之。<br>
          争议之处并列各家，不作唯一结论。
        </p>
        ${sealSVG().replace('class="seal"','class="seal" style="position:static;width:52px;height:52px;margin:24px auto 0;opacity:.7"')}
      </section>`;
    const list = app.querySelector('#modlist');
    list.innerHTML = C.modules.map(m=>`
      <a class="modrow" href="#/module/${m.id}">
        <span class="idx">${m.id}</span>
        <span class="body">
          <div class="era">${esc(m.era)}</div>
          <h3>${esc(m.title)}</h3>
          <p class="lead">${esc(m.lead)}</p>
          <span class="count">${m.chapters.length} 章</span>
        </span>
        <span class="arrow">›</span>
      </a>`).join('');
  }

  /* ---------- 目录 ---------- */
  function renderCatalog(){
    setTopbarDark(false); setNav('catalog');
    app.innerHTML = `
      <section class="wrap" style="padding:96px 0 10px">
        <div class="section-head">
          <span class="no">CATALOG · 全部目录</span>
          <h2>课程章节</h2>
          <p class="desc">点击章节进入阅读。带「✓」的章节为你已读完。</p>
        </div>
        <div id="catlist"></div>
      </section>`;
    const list = app.querySelector('#catlist');
    list.innerHTML = C.modules.map(m=>`
      <div class="atlas-era">
        <h3>${m.id} · ${esc(m.title)}</h3>
        ${m.chapters.map(c=>{
          const d = S.done[c.id];
          return `<a class="chapter-item" href="#/chapter/${c.id}">
            <span class="cn">${c.id}</span><span class="ce">${esc(c.era)}</span>
            <h3>${esc(c.title)} ${d?'<span class="cdone">✓ 已读</span>':''}</h3>
            <div class="cq">${esc(c.question)}</div>
          </a>`;
        }).join('')}
      </div>`).join('');
  }

  /* ---------- 模块页 ---------- */
  function renderModule(id){
    setTopbarDark(false); setNav('catalog');
    const m = C.modules.find(x=>x.id===id);
    if(!m){ app.innerHTML='<div class="wrap section">模块不存在</div>'; return; }
    app.innerHTML = `
      <section class="modhero">
        <span class="roman">${m.roman}</span>
        <a href="#/catalog" class="back">‹ 返回目录</a>
        <span class="idx">MODULE ${m.id}</span>
        <h1>${esc(m.title)}</h1>
        <p class="lead">${esc(m.lead)}</p>
        <div class="era">${esc(m.era)} · ${m.chapters.length} 章</div>
      </section>
      <section class="wrap chapter-list">
        ${m.chapters.map(c=>{
          const d=S.done[c.id];
          return `<a class="chapter-item" href="#/chapter/${c.id}">
            <span class="cn">${c.id}</span><span class="ce">${esc(c.era)}</span>
            <h3>${esc(c.title)} ${d?'<span class="cdone">✓ 已读</span>':''}</h3>
            <div class="cq">${esc(c.question)}</div>
          </a>`;
        }).join('')}
      </section>`;
  }

  /* ---------- 章节阅读页 ---------- */
  function renderChapter(id){
    setTopbarDark(false); setNav('catalog');
    const c = findChapter(id);
    if(!c){ app.innerHTML='<div class="wrap section">章节不存在</div>'; return; }
    const lesson = L[id];
    const idx = allChapters().findIndex(x=>x.id===id);
    const all = allChapters();
    const prev = all[idx-1], next = all[idx+1];

    if(!lesson){
      // 尚未编写正文的章节：显示结构占位，诚实标注
      app.innerHTML = `
        <article class="article wrap">
          <div class="article-head">
            <div class="crumb"><a href="#/module/${c.mod.id}">${c.mod.id} ${esc(c.mod.title)}</a> · ${c.id}</div>
            <h1>${esc(c.title)}</h1>
            <span class="era">${esc(c.era)}</span>
            <div class="question"><span class="q-label">本章追问 · THE QUESTION</span><p>${esc(c.question)}</p></div>
          </div>
          <div class="article-body" style="padding-top:40px">
            <div class="callout concept">
              <div class="ch">◈ 章节大纲已就绪 · 正文编写中</div>
              <div class="cb">
                <p>${esc(c.summary)}</p>
                <p style="font-size:13px;color:var(--ink-soft)">本章属于分期开发的后续批次。结构、核心问题与三书来源已确定，完整教学正文待补齐。</p>
              </div>
            </div>
          </div>
          ${pagenavHTML(prev,next)}
        </article>`;
      attachPagenav();
      return;
    }

    app.innerHTML = `
      <article class="article wrap">
        <div class="article-head">
          <div class="crumb"><a href="#/module/${c.mod.id}">${c.mod.id} ${esc(c.mod.title)}</a> · ${c.id}</div>
          <h1>${esc(c.title)}</h1>
          <span class="era">${esc(c.era)}</span>
          <div class="question"><span class="q-label">本章追问 · THE QUESTION</span><p>${esc(c.question)}</p></div>
        </div>
        <div class="article-body" id="articleBody">
          ${renderBlocks(lesson.blocks)}
        </div>
        ${renderSourceMap(c, lesson)}
        ${markDoneHTML(id)}
        ${pagenavHTML(prev,next)}
      </article>`;

    attachMarkDone(id);
    attachPagenav();
    // 阅读进度条
    const onScroll = ()=>{
      const h=document.documentElement;
      const max=h.scrollHeight-h.clientHeight;
      progressBar.style.width = max>0 ? Math.min(100,(h.scrollTop/max)*100)+'%' : '0';
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    app._cleanupScroll = ()=>window.removeEventListener('scroll',onScroll);
  }

  function renderBlocks(blocks){
    if(!blocks) return '';
    return blocks.map(b=>{
      switch(b.type){
        case 'lead': return `<p class="lead-p">${inline(b.text)}</p>`;
        case 'p': return `<p>${inline(b.text)}</p>`;
        case 'h2': return `<h2>${esc(b.text)}</h2>`;
        case 'h3': return `<h3>${esc(b.text)}</h3>`;
        case 'quote': return `<blockquote class="quote">${inline(b.text)}<span class="src">— ${esc(b.src||'')}</span></blockquote>`;
        case 'callout': return `
          <div class="callout ${b.kind||'concept'}">
            <div class="ch">${calloutIcon(b.kind)} ${esc(b.title||'')}</div>
            <div class="cb">${(b.paras||[]).map(p=>`<p>${inline(p)}</p>`).join('')}</div>
          </div>`;
        case 'diagram': return diagramHTML(b);
        case 'map': return mapHTML(b);
        case 'timeline': return `<div class="timeline">${(b.items||[]).map(i=>`
            <div class="tl-item"><div class="tlyr">${esc(i.year)}</div><div class="tltx">${esc(i.text)}</div></div>`).join('')}</div>`;
        case 'figures': return `<div style="margin:26px 0">${(b.items||[]).map(f=>`
            <div class="callout figure" style="margin:12px 0"><div class="cb"><div class="figcard">
              <div class="avatar">${esc(f.name.charAt(0))}</div>
              <div><h4>${esc(f.name)} <span class="years">${esc(f.years||'')}</span></h4>
              <p>${inline(f.desc)}</p></div>
            </div></div></div>`).join('')}</div>`;
        case 'raw': return b.html;
        default: return '';
      }
    }).join('');
  }

  function inline(t){
    if(t==null) return '';
    return esc(t)
      .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g,'<em>$1</em>')
      .replace(/『([^』]+)』/g,'<span class="term" title="重点概念">『$1』</span>');
  }
  function calloutIcon(k){
    return ({institution:'▦',concept:'◈',figure:'人',debate:'⚖'})[k]||'◈';
  }
  function diagramHTML(b){
    const svg = (M.diagrams&&M.diagrams[b.key]) ? M.diagrams[b.key] : placeholderDiagram(b.title);
    return `<div class="diagram"><div class="dtitle">${esc(b.title||'结构示意')}</div>${svg}
      ${b.caption?`<div class="dcaption">${esc(b.caption)}</div>`:''}</div>`;
  }
  function mapHTML(b){
    const svg = (M.maps&&M.maps[b.key]) ? M.maps[b.key] : placeholderMap();
    return `<div class="mapbox">
      <div class="maphead"><span>${esc(b.title||'历史地图')}</span><span class="yr">${esc(b.year||'')}</span></div>
      ${svg}
      <div class="mapnote">${esc(b.note||'示意图：仅示相对方位与大致范围，非精确疆界。不同年代疆域不混用。')}</div>
    </div>`;
  }
  function placeholderDiagram(t){
    return `<svg viewBox="0 0 320 120"><rect x="10" y="10" width="300" height="100" rx="6" fill="none" stroke="#8a7547" stroke-dasharray="5 4"/><text x="160" y="65" text-anchor="middle" font-size="14" fill="#8a7547" font-family="sans-serif">${esc(t||'示意图')}</text></svg>`;
  }
  function placeholderMap(){
    return `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#efe6d4"/><text x="160" y="100" text-anchor="middle" font-size="14" fill="#8a7547" font-family="sans-serif">地图示意</text></svg>`;
  }

  function renderSourceMap(c, lesson){
    const sm = lesson.sourceMap || c.sourceMap || {};
    const names={lv:'吕思勉《中国通史》',qian:'钱穆《国史大纲》',k:'讲谈社《中国的历史》'};
    return `<div class="sourcemap">
      <h4>◈ 本章资料来源 · SOURCES</h4>
      ${Object.keys(sm).map(key=>`<div class="srow"><span class="stag">${names[key]||key}</span><span class="sval">${esc(sm[key])}</span></div>`).join('')}
      <p class="disclaimer">本课程综合上述著作，用自己的语言重新组织与解释。各书观点有同有异，正文所述若涉及分歧会明确标出，不将任何一家之说作为唯一结论。史实与解释、考古证据与传世文献已分别标识。</p>
    </div>`;
  }
  function markDoneHTML(id){
    const d=S.done[id];
    return `<div style="margin-top:30px;text-align:center">
      <button class="iconbtn" id="btnDone" style="width:auto;padding:0 22px;border-radius:24px;${d?'background:var(--jade);color:#fff;border-color:var(--jade)':''}">
        ${d?'✓ 已读完本章 · 点击取消':'标记本章读完'}
      </button>
    </div>`;
  }
  function attachMarkDone(id){
    const b=document.getElementById('btnDone');
    if(!b) return;
    b.addEventListener('click',()=>{
      S.done[id]=!S.done[id]; save();
      toast(S.done[id]?'已记录学习进度':'已取消标记');
      renderChapter(id);
    });
  }
  function pagenavHTML(prev,next){
    return `<div class="pagenav">
      ${prev?`<a class="prev" href="#/chapter/${prev.id}"><span class="lbl">‹ 上一章</span>${esc(prev.title)}</a>`:`<a class="prev disabled"><span class="lbl">‹ 上一章</span>已是开篇</a>`}
      ${next?`<a class="next" href="#/chapter/${next.id}"><span class="lbl">下一章 ›</span>${esc(next.title)}</a>`:`<a class="next disabled"><span class="lbl">下一章 ›</span>课程完结</a>`}
    </div>`;
  }
  function attachPagenav(){ /* 由 hash 路由自动处理 */ }

  /* ---------- 时空页（时间轴 + 地图） ---------- */
  function renderAtlas(){
    setTopbarDark(false); setNav('atlas');
    const tl = M.timeline || [];
    const maps = M.atlasMaps || [];
    app.innerHTML = `
      <section class="wrap" style="padding:96px 0 10px">
        <div class="section-head">
          <span class="no">ATLAS · 时空</span>
          <h2>时间轴与历史地图</h2>
          <p class="desc">地图均标注对应年代；示意图仅表相对方位，非精确疆界，不同年代疆域不混用。</p>
        </div>
        <div class="section-head" style="margin-top:20px"><span class="no">TIMELINE · 大事记</span></div>
        <div class="global-tl">
          ${tl.map(x=>`<div class="gt-row"><div class="gt-year">${esc(x.year)}</div><div class="gt-dot"></div><div class="gt-body"><b>${esc(x.title)}</b><span>${esc(x.desc)}</span></div></div>`).join('')}
        </div>
        <div class="section-head" style="margin-top:50px"><span class="no">MAPS · 疆域示意</span></div>
        ${maps.map(m=>`<div class="mapbox" style="margin-bottom:18px">
          <div class="maphead"><span>${esc(m.title)}</span><span class="yr">${esc(m.year)}</span></div>
          ${M.maps&&M.maps[m.key]?M.maps[m.key]:placeholderMap()}
          <div class="mapnote">${esc(m.note||'示意图：仅示相对方位与大致范围，非精确疆界。')}</div>
        </div>`).join('')}
      </section>`;
  }

  /* ---------- 我的进度 ---------- */
  function renderProgress(){
    setTopbarDark(false); setNav('progress');
    const all=allChapters(); const done=all.filter(c=>S.done[c.id]);
    const pct=all.length?Math.round(done.length/all.length*100):0;
    app.innerHTML = `
      <section class="wrap" style="padding:96px 0 10px">
        <div class="section-head"><span class="no">PROGRESS · 我的学习</span><h2>学习进度</h2></div>
        <div class="callout institution"><div class="ch">▦ 总进度</div><div class="cb">
          <p style="font-size:26px;font-weight:700;color:var(--cinnabar)">${pct}%</p>
          <p>已读完 ${done.length} / ${all.length} 章</p>
        </div></div>
        ${done.length?`<h3 style="margin-top:30px;font-size:16px">已读章节</h3>${done.map(c=>`
          <a class="chapter-item" href="#/chapter/${c.id}"><span class="cn">${c.id}</span><h3>${esc(c.title)}</h3></a>`).join('')}`
        :`<p style="color:var(--ink-soft);margin-top:24px">还没有开始阅读。去目录挑一章开始吧。</p>`}
        <p style="text-align:center;margin-top:40px"><a href="#/catalog" class="iconbtn" style="width:auto;padding:0 20px;border-radius:22px">查看目录</a></p>
      </section>`;
  }

  /* ---------- 设置面板 ---------- */
  const mask=document.getElementById('sheetMask');
  const sheet=document.getElementById('settingSheet');
  function openSheet(){ mask.classList.add('show'); sheet.classList.add('show'); }
  function closeSheet(){ mask.classList.remove('show'); sheet.classList.remove('show'); }
  document.getElementById('btnSetting').onclick=openSheet;
  mask.onclick=closeSheet;
  document.getElementById('btnAtlas').onclick=()=>{location.hash='#/atlas';};
  document.getElementById('segFont').addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    S.fs=b.dataset.fs; save(); applyPrefs();
  });
  document.getElementById('segTheme').addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    S.theme=b.dataset.theme; save(); applyPrefs();
  });
  document.getElementById('btnReset').onclick=()=>{
    if(confirm('确定清除全部学习进度？此操作不可恢复。')){
      S.done={}; save(); toast('进度已清除'); closeSheet(); render();
    }
  };

  brand.addEventListener('click',()=>setTimeout(()=>setTopbarDark(true),0));

  window.addEventListener('hashchange',()=>{
    if(app._cleanupScroll){ app._cleanupScroll(); app._cleanupScroll=null; }
    render();
  });
  applyPrefs();
  render();
})();
