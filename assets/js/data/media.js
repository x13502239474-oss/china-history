/* ============================================================
   时空素材：全局时间轴、示意地图、制度结构图
   地图均为示意图，标注年代，不混用不同年代疆域，非精确疆界
   ============================================================ */

/* 通用中国轮廓底图（高度抽象示意，仅表大致方位） */
function chinaBase(inner){
  return `<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(138,117,71,.12)" stroke-width=".6"/>
      </pattern>
    </defs>
    <rect width="320" height="220" fill="#efe6d4"/>
    <rect width="320" height="220" fill="url(#grid)"/>
    <path d="M52,58 Q70,40 96,44 L120,32 L150,40 L178,30 L214,40 L246,34 L272,52 L268,74 L286,86 L276,108 L288,124 L264,140 L270,164 L242,180 L206,188 L176,178 L140,186 L108,172 L84,180 L66,158 L48,140 L56,116 L42,96 Z"
      fill="#e3d6bb" stroke="#8a7547" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M120,32 Q150,52 178,30 M96,44 Q110,70 90,96 M214,40 Q206,70 236,86 M176,178 Q168,146 150,120"
      fill="none" stroke="#b29a63" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>
    <text x="24" y="26" font-size="9" fill="#8a7547" font-family="sans-serif">N ↑</text>
    ${inner||''}
  </svg>`;
}

/* 批量生成「点标注式」示意地图：pts = [[x,y,label],...] */
function ptsMap(pts, foot){
  const dots = pts.map(p=>{
    const col = p[3]||'#9c362a';
    return `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${col}" opacity=".85"/>`+
      (p[2]?`<text x="${p[0]+6}" y="${p[1]+3}" font-size="9" fill="#3a3226" font-family="sans-serif">${p[2]}</text>`:'');
  }).join('');
  return chinaBase(dots + `<text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">${foot||'方位示意 · 非精确疆界'}</text>`);
}
/* 生成「区域+标注」式地图 */
function regionMap(path, pts, foot){
  const dots = (pts||[]).map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#9c362a" opacity=".85"/>`+
    (p[2]?`<text x="${p[0]+6}" y="${p[1]+3}" font-size="9" fill="#3a3226" font-family="sans-serif">${p[2]}</text>`:'')).join('');
  return chinaBase(`<path d="${path}" fill="rgba(156,54,42,.12)" stroke="#9c362a" stroke-width="1.4"/>${dots}`+
    `<text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">${foot||'示意 · 非精确疆界'}</text>`);
}
/* 通用流程/层级结构图：levels = [[{t,note},...],...]，按层纵向排列 */
function flowDiagram(levels, foot){
  let s=''; const top=10, lh=44;
  levels.forEach((row,ri)=>{
    const y=top+ri*lh; const w=Math.min(72, 280/row.length-6); const total=row.length*w+(row.length-1)*8;
    let x=(320-total)/2;
    row.forEach(cell=>{
      const main=cell.t||cell, sub=cell.note||'';
      const fill = ri===0?'#1b1a17':(ri===levels.length-1?'#5c6b57':'#e7ddcc');
      const tc = ri===0||ri===levels.length-1?'#f5f0e6':'#2b2822';
      s+=`<rect x="${x}" y="${y}" width="${w}" height="30" rx="4" fill="${fill}" stroke="#8a7547"/>`+
         `<text x="${x+w/2}" y="${y+13}" text-anchor="middle" font-size="10" fill="${tc}" font-family="sans-serif">${main}</text>`;
      if(sub) s+=`<text x="${x+w/2}" y="${y+25}" text-anchor="middle" font-size="7.5" fill="${tc}" opacity=".8" font-family="sans-serif">${sub}</text>`;
      x+=w+8;
    });
  });
  if(foot) s+=`<text x="160" y="${top+levels.length*lh+6}" text-anchor="middle" font-size="9" fill="#9c362a" font-family="sans-serif">${foot}</text>`;
  return `<svg viewBox="0 0 320 ${top+levels.length*lh+20}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

window.MEDIA = {
  /* ---------- 全局大事记 ---------- */
  timeline: [
    {year:"约前1万年",title:"农业起源",desc:"华北粟黍、长江稻作分别开始驯化"},
    {year:"约前3000年",title:"良渚古城",desc:"长江下游出现大型都邑与玉器礼制"},
    {year:"约前1600年",title:"商王朝建立",desc:"甲骨文与青铜礼制成熟"},
    {year:"前1046年",title:"武王克商",desc:"西周建立，分封宗法秩序形成"},
    {year:"前770年",title:"平王东迁",desc:"春秋开始，王室衰微，霸政兴起"},
    {year:"前475年",title:"战国时代",desc:"变法运动，耕战体制，七雄并立"},
    {year:"前221年",title:"秦统一",desc:"皇帝制、郡县制，大一统帝国确立"},
    {year:"前202年",title:"汉朝建立",desc:"汉承秦制，渐次确立儒术治国"},
    {year:"220年",title:"三国开端",desc:"统一帝国瓦解，进入长期分裂"},
    {year:"589年",title:"隋统一",desc:"三省六部、科举初创，隋唐帝国奠基"},
    {year:"755年",title:"安史之乱",desc:"帝国结构转折，藩镇割据形成"},
    {year:"960年",title:"北宋建立",desc:"强干弱枝，士大夫政治成熟"},
    {year:"1279年",title:"元灭南宋",desc:"草原征服者建立大一统王朝"},
    {year:"1368年",title:"明朝建立",desc:"君主专制强化，废丞相设内阁"},
    {year:"1644年",title:"明清易代",desc:"满洲入关，部族政权再建"},
    {year:"1840年",title:"鸦片战争",desc:"朝贡体系遭遇条约体系冲击"},
    {year:"1911年",title:"辛亥革命",desc:"帝制终结，民国创建"},
    {year:"1919年",title:"五四运动",desc:"思想激进转向，现代中国萌生"}
  ],

  /* ---------- 时空页地图 ---------- */
  atlasMaps: [
    {key:"neolithic",title:"新石器时代主要文化分布",year:"约前5000—前2000年",note:"示意图：仅示各大文化区大致方位，非精确范围。"},
    {key:"shang",title:"商代方国与中心区域",year:"约前1600—前1046年",note:"示意图：示商王畿与周边方国相对方位，非精确疆界。"},
    {key:"zhoufeng",title:"西周分封诸侯示意",year:"前1046—前771年",note:"示意图：示主要封国方位，非精确疆界。"},
    {key:"zhanguo",title:"战国七雄形势",year:"前475—前221年",note:"示意图：示七雄大致方位，非精确疆界。"},
    {key:"qin",title:"秦郡县与帝国疆域",year:"前221—前207年",note:"示意图：示帝国核心区域与郡县扩展方向，非精确疆界。"},
    {key:"han",title:"西汉郡国与边疆",year:"前202年—公元8年",note:"示意图：示郡国与边疆大致范围，非精确疆界。"},
    {key:"xiyu",title:"汉匈形势与西域交通",year:"前2—前1世纪",note:"示意图：示匈奴、西域都护与河西四郡方位，非精确疆界。"},
    {key:"sanguo",title:"三国势力范围",year:"220—280年",note:"示意图：示魏蜀吴大致方位，非精确疆界。"},
    {key:"nanbei",title:"南北朝政权分布",year:"420—589年",note:"示意图：示南北政权大致方位，非精确疆界。"},
    {key:"tang",title:"唐朝鼎盛疆域与交通",year:"8世纪前半",note:"示意图：示鼎盛期疆域与主要交通节点，非精确疆界。"},
    {key:"songliao",title:"宋辽夏金并立形势",year:"12世纪",note:"示意图：示四个政权大致方位，非精确疆界。"},
    {key:"yuan",title:"元朝疆域与行省治所",year:"14世纪",note:"示意图：示帝国范围与行省治所方位，非精确疆界。"},
    {key:"ming",title:"明朝疆域与两京",year:"1368—1644年",note:"示意图：示明朝疆域与两京方位，非精确疆界。"},
    {key:"qing",title:"清朝鼎盛疆域",year:"18世纪",note:"示意图：示鼎盛期疆域范围，非精确疆界。"},
    {key:"lateqing",title:"晚清列强势力范围",year:"19世纪末",note:"示意图：示势力范围大致分布，非精确疆界。"},
    {key:"minguo",title:"民国时期政治势力",year:"1920年代",note:"示意图：示主要政治势力大致方位，非精确疆界。"}
  ],

  maps: {
    neolithic: chinaBase(`
      <circle cx="150" cy="86" r="20" fill="rgba(156,54,42,.18)" stroke="#9c362a" stroke-dasharray="3 2"/>
      <text x="150" y="90" font-size="10" fill="#7d2a20" text-anchor="middle" font-family="sans-serif">仰韶·龙山</text>
      <circle cx="215" cy="120" r="16" fill="rgba(92,107,87,.18)" stroke="#5c6b57" stroke-dasharray="3 2"/>
      <text x="215" y="124" font-size="9" fill="#5c6b57" text-anchor="middle" font-family="sans-serif">大汶口</text>
      <circle cx="238" cy="150" r="15" fill="rgba(138,117,71,.2)" stroke="#8a7547" stroke-dasharray="3 2"/>
      <text x="238" y="154" font-size="9" fill="#6b5a35" text-anchor="middle" font-family="sans-serif">良渚</text>
      <circle cx="176" cy="160" r="12" fill="rgba(156,54,42,.12)" stroke="#9c362a" stroke-dasharray="3 2"/>
      <text x="176" y="164" font-size="8" fill="#7d2a20" text-anchor="middle" font-family="sans-serif">石家河</text>
      <text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">黄河流域 · 长江流域</text>`),
    shang: chinaBase(`
      <ellipse cx="150" cy="92" rx="26" ry="20" fill="rgba(156,54,42,.22)" stroke="#9c362a" stroke-width="1.2"/>
      <text x="150" y="96" font-size="10" fill="#7d2a20" text-anchor="middle" font-family="sans-serif">商王畿</text>
      <text x="150" y="108" font-size="8" fill="#7d2a20" text-anchor="middle" font-family="sans-serif">殷</text>
      ${[[110,70],[190,66],[96,110],[208,104],[170,60],[130,132]].map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#b29a63"/><text x="${p[0]+6}" y="${p[1]+3}" font-size="8" fill="#6b5a35" font-family="sans-serif">方国</text>`).join('')}
      <text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">内服（王畿）· 外服（方国）</text>`),
    zhoufeng: chinaBase(`
      <circle cx="150" cy="80" r="6" fill="#9c362a"/><text x="150" y="74" font-size="9" fill="#7d2a20" text-anchor="middle" font-family="sans-serif">周（镐京）</text>
      ${[[196,86,"齐"],[182,102,"鲁"],[150,108,"宋"],[120,96,"晋"],[224,120,"吴"],[196,146,"楚"],[110,130,"秦"]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#8a7547"/><text x="${p[0]+5}" y="${p[1]+3}" font-size="9" fill="#6b5a35" font-family="sans-serif">${p[2]}</text>`).join('')}
      <text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">主要封国方位示意</text>`),
    zhanguo: chinaBase(`
      ${[[104,88,"秦"],[128,68,"赵"],[110,52,"燕"],[176,72,"魏"],[200,90,"齐"],[176,150,"楚"],[158,100,"韩"]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#9c362a" opacity=".8"/><text x="${p[0]+5}" y="${p[1]+3}" font-size="10" fill="#7d2a20" font-family="sans-serif">${p[2]}</text>`).join('')}
      <text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">七雄方位示意 · 西秦东齐南楚</text>`),
    qin: chinaBase(`
      <path d="M52,58 Q90,44 130,52 L180,40 L230,50 L262,70 L268,110 L250,150 L206,172 L150,180 L96,170 L60,140 L48,96 Z"
        fill="rgba(156,54,42,.12)" stroke="#9c362a" stroke-width="1.4"/>
      <circle cx="148" cy="70" r="5" fill="#7d2a20"/><text x="148" y="62" font-size="9" fill="#7d2a20" text-anchor="middle" font-family="sans-serif">咸阳</text>
      ${[[80,80],[110,120],[190,90],[230,110],[170,150],[120,160]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#8a7547"/>`).join('')}
      <text x="160" y="210" font-size="8" fill="#8a7547" text-anchor="middle" font-family="sans-serif">郡县治所示意 · 帝国核心区域</text>`),

    /* 秦汉 */
    han: regionMap("M48,56 Q90,42 140,50 L200,38 L250,50 L278,72 L272,116 L250,156 L206,176 L150,182 L96,172 L56,142 L44,96 Z",
      [[150,72,"长安"],[178,88,"洛阳"],[96,96,"河西"],[230,120,"东海郡"]],"西汉郡国与边疆 · 前202—公元8年"),
    xiyu: ptsMap([[70,86,"西域都护"],[110,92,"河西四郡"],[150,72,"长安"],[210,88,"匈奴"],[240,70,"左贤王部"]],"汉匈形势与西域交通 · 前2—前1世纪"),
    handong: ptsMap([[150,72,"洛阳"],[210,120,"青州"],[240,150,"会稽"],[176,164,"荆州"],[110,130,"益州"]],"东汉州郡与经济区重心 · 1—2世纪"),
    /* 魏晋南北朝 */
    sanguo: ptsMap([[120,80,"魏·洛阳"],[160,150,"吴·建业"],[96,140,"蜀·成都"],[210,90,"魏·邺"]],"三国势力范围 · 220—280年"),
    jin: regionMap("M52,58 Q90,44 132,52 L180,42 L228,52 L262,72 L266,112 L246,150 L204,170 L150,178 L98,168 L60,138 L48,96 Z",
      [[150,74,"洛阳"],[176,86,"长安"],[96,90,"凉州"]],"西晋统一疆域 · 280—316年"),
    nanbei: ptsMap([[200,96,"南朝·建康"],[150,74,"北朝·洛阳"],[128,60,"北魏·平城"],[176,150,"梁·江陵"],[110,130,"西魏/北周"]],"南北朝政权分布 · 420—589年"),
    /* 隋唐 */
    sui: regionMap("M50,56 Q92,42 140,50 L196,40 L248,50 L276,72 L270,114 L248,154 L204,174 L148,182 L94,170 L56,140 L46,94 Z",
      [[170,76,"大兴城"],[196,92,"东都洛阳"],[236,140,"江都"]],"隋朝疆域与大运河节点 · 581—618年"),
    tang: regionMap("M46,50 Q92,36 146,44 L204,32 L258,42 L292,62 L288,74 L274,80 L272,120 L250,160 L204,180 L146,186 L90,174 L52,144 L42,92 Z",
      [[170,72,"长安"],[200,88,"洛阳"],[240,120,"扬州"],[92,80,"安西"],[210,150,"广州"]],"唐朝鼎盛疆域与交通 · 8世纪前半"),
    tangfan: ptsMap([[170,72,"唐中央·长安"],[120,84,"凤翔"],[206,96,"汴州"],[150,110,"河中"],[236,132,"淮南"],[110,140,"四川"]],"唐后期藩镇分布示意 · 9世纪"),
    /* 宋辽夏金 */
    song: regionMap("M74,74 Q110,60 150,66 L196,58 L232,72 L238,110 L220,146 L182,166 L138,170 L104,158 L82,130 L72,100 Z",
      [[180,96,"东京开封"],[210,140,"临安"],[120,120,"成都"]],"北宋/南宋疆域核心区 · 960—1279年"),
    songliao: ptsMap([[86,66,"辽·上京"],[150,76,"宋·东京"],[118,104,"西夏·兴庆"],[216,66,"金·上京"],[190,140,"南宋·临安"]],"宋辽夏金并立形势 · 12世纪"),
    /* 蒙元 */
    yuan: regionMap("M40,46 Q92,32 148,40 L212,28 L268,38 L300,58 L296,90 L276,100 L274,140 L246,176 L196,190 L140,192 L88,178 L48,146 L36,94 Z",
      [[176,72,"大都"],[228,110,"上都"],[130,120,"西安"],[210,160,"杭州"]],"元朝疆域与行省治所 · 14世纪"),
    mongol: ptsMap([[236,52,"蒙古高原·和林"],[150,72,"中亚"],[70,86,"西亚"],[196,92,"大都"],[258,140,"南宋"]],"蒙古帝国扩张方向 · 13世纪"),
    /* 明清 */
    ming: regionMap("M48,54 Q92,40 142,48 L198,38 L250,48 L278,70 L272,112 L248,152 L202,172 L148,180 L94,168 L56,138 L46,92 Z",
      [[176,74,"北京"],[212,150,"南京"],[150,110,"西安"],[240,130,"杭州"]],"明朝疆域与两京 · 1368—1644年"),
    mingsea: ptsMap([[240,150,"泉州"],[252,168,"广州"],[196,180,"刘家港"],[278,140,"占城"],[288,170,"三佛齐"]],"郑和航路与海上交通 · 15世纪"),
    qing: regionMap("M38,46 Q90,30 150,38 L216,26 L276,36 L304,56 L300,92 L282,104 L280,146 L250,182 L198,194 L138,194 L84,180 L44,148 L34,92 Z",
      [[176,72,"北京"],[212,152,"江宁"],[96,80,"伊犁"],[258,120,"台湾"]],"清朝鼎盛疆域 · 18世纪"),
    lateqing: ptsMap([[176,72,"京畿"],[232,116,"长江流域"],[252,160,"两广"],[100,120,"西南"],[278,96,"东北"]],"晚清列强势力范围示意 · 19世纪末"),
    minguo: ptsMap([[212,150,"南京国民政府"],[176,84,"北洋系"],[120,130,"西南军阀"],[240,110,"东南"],[98,80,"西北"]],"民国时期政治势力示意 · 1920年代")
  },

  /* ---------- 制度结构图 ---------- */
  diagrams: {
    neolithicSociety: `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
      <text x="160" y="16" text-anchor="middle" font-size="10" fill="#8a7547" font-family="sans-serif">农业 → 剩余 → 分工 → 分层</text>
      ${['农业定居','粮食剩余','人口增长','社会分工','财富分化','首领权'].map((s,i)=>{
        const x=20+i*50; return `<rect x="${x}" y="50" width="44" height="34" rx="4" fill="#e7ddcc" stroke="#8a7547"/><text x="${x+22}" y="71" text-anchor="middle" font-size="9" fill="#2b2822" font-family="sans-serif">${s.slice(0,2)}</text><text x="${x+22}" y="81" text-anchor="middle" font-size="9" fill="#2b2822" font-family="sans-serif">${s.slice(2)}</text>${i<5?`<path d="M${x+44} 67 L${x+50} 67" stroke="#9c362a" stroke-width="1.4" marker-end="url(#ar)"/>`:''}`;
      }).join('')}
      <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9c362a"/></marker></defs>
      <text x="160" y="120" text-anchor="middle" font-size="9" fill="#9c362a" font-family="sans-serif">考古所见：聚落规模、墓葬随葬品的差异</text>
    </svg>`,
    shangStructure: `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="120" y="12" width="80" height="30" rx="4" fill="#9c362a"/><text x="160" y="31" text-anchor="middle" font-size="12" fill="#fff" font-family="sans-serif">商 王</text>
      <path d="M160 42 L160 60 M90 60 L230 60 M90 60 L90 72 M230 60 L230 72" fill="none" stroke="#8a7547" stroke-width="1.4"/>
      <rect x="52" y="72" width="76" height="34" rx="4" fill="#e7ddcc" stroke="#8a7547"/><text x="90" y="93" text-anchor="middle" font-size="11" fill="#2b2822" font-family="sans-serif">内服·王畿</text>
      <rect x="192" y="72" width="76" height="34" rx="4" fill="#e7ddcc" stroke="#8a7547"/><text x="230" y="93" text-anchor="middle" font-size="11" fill="#2b2822" font-family="sans-serif">外服·方国</text>
      <text x="90" y="122" text-anchor="middle" font-size="9" fill="#6b5a35" font-family="sans-serif">王直接治理</text>
      <text x="230" y="122" text-anchor="middle" font-size="9" fill="#6b5a35" font-family="sans-serif">臣服纳贡</text>
      <text x="160" y="152" text-anchor="middle" font-size="9" fill="#9c362a" font-family="sans-serif">维系纽带：祖先祭祀 + 青铜礼器 + 甲骨占卜</text>
    </svg>`,
    zhouStructure: `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="122" y="8" width="76" height="26" rx="4" fill="#1b1a17"/><text x="160" y="26" text-anchor="middle" font-size="11" fill="#f5f0e6" font-family="sans-serif">周天子</text>
      <path d="M160 34 L160 48 M64 48 L256 48 M64 48 L64 58 M160 48 L160 58 M256 48 L256 58" fill="none" stroke="#8a7547" stroke-width="1.4"/>
      <rect x="30" y="58" width="68" height="30" rx="4" fill="#e7ddcc" stroke="#8a7547"/><text x="64" y="77" text-anchor="middle" font-size="10" fill="#2b2822" font-family="sans-serif">同姓宗亲</text>
      <rect x="126" y="58" width="68" height="30" rx="4" fill="#e7ddcc" stroke="#8a7547"/><text x="160" y="77" text-anchor="middle" font-size="10" fill="#2b2822" font-family="sans-serif">异姓功臣</text>
      <rect x="222" y="58" width="68" height="30" rx="4" fill="#e7ddcc" stroke="#8a7547"/><text x="256" y="77" text-anchor="middle" font-size="10" fill="#2b2822" font-family="sans-serif">先代后裔</text>
      <text x="160" y="106" text-anchor="middle" font-size="10" fill="#7d2a20" font-family="sans-serif">分封制（授民授疆土）</text>
      <line x1="30" y1="118" x2="290" y2="118" stroke="var(--line)" stroke-width="1"/>
      <text x="160" y="138" text-anchor="middle" font-size="10" fill="#7d2a20" font-family="sans-serif">宗法制：嫡长子继承 · 大宗小宗</text>
      <rect x="96" y="150" width="128" height="26" rx="4" fill="#5c6b57"/><text x="160" y="168" text-anchor="middle" font-size="10" fill="#fff" font-family="sans-serif">礼乐秩序（等级名分）</text>
      <text x="160" y="193" text-anchor="middle" font-size="9" fill="#8a7547" font-family="sans-serif">经济基础：井田制 · 劳役地租</text>
    </svg>`,

    /* 秦汉 */
    commandery: flowDiagram([
      [{t:'皇帝'}],
      [{t:'三公',note:'丞相·太尉·御史大夫'}],
      [{t:'九卿',note:'分管具体事务'}],
      [{t:'郡',note:'守·尉·监'}],[{t:'县',note:'令·丞·尉'}]
    ],"秦：中央三公九卿 → 地方郡县，官吏由中央任免"),
    hanGovernance: flowDiagram([
      [{t:'汉初',note:'黄老无为·休养生息'}],
      [{t:'汉武帝',note:'独尊儒术·加强集权'}],
      [{t:'外儒内法',note:'儒术为表·法令为里'}]
    ],"治国思想的转向：从无为到有为"),

    /* 魏晋南北朝 */
    nineRank: flowDiagram([
      [{t:'中正官',note:'品评人物'}],
      [{t:'九品',note:'上上至下下'}],
      [{t:'吏部',note:'按品授官'}]
    ],"九品中正制：才学标准渐被门第取代，形成上品无寒门"),

    /* 隋唐 · 重点：三制关系 */
    fubingSystem: flowDiagram([
      [{t:'均田制',note:'国家授田给农民'}],
      [{t:'租庸调',note:'纳粮·服役·纳绢（赋税）'}, {t:'府兵制',note:'授田农民轮番当兵（兵役）'}],
      [{t:'共同基础',note:'国家对土地与户籍的控制'}]
    ],"均田是基础：有田才纳租庸调、才充府兵；土地兼并→均田坏→三制俱崩"),
    threeDepartments: flowDiagram([
      [{t:'皇帝'}],
      [{t:'中书省',note:'草拟诏令'},{t:'门下省',note:'审核封驳'},{t:'尚书省',note:'执行政令'}],
      [{t:'六部',note:'吏户礼兵刑工'}]
    ],"三省六部：决策—审核—执行相互制衡，相权分散"),
    fanzhen: flowDiagram([
      [{t:'安史之乱'}],
      [{t:'节度使',note:'掌兵·财·政'}],
      [{t:'藩镇割据',note:'河朔三镇等'}],
      [{t:'唐廷',note:'财政依赖东南·无力削藩'}]
    ],"藩镇割据的形成逻辑"),

    /* 宋 */
    songCentral: flowDiagram([
      [{t:'收兵权',note:'杯酒释兵权'}],
      [{t:'分相权',note:'设参知政事·枢密院·三司'}],
      [{t:'强干弱枝',note:'中央集权·地方积弱'}],
      [{t:'重文轻武',note:'士大夫政治·冗官冗兵冗费'}]
    ],"宋代中央集权的设计与代价"),
    keju: flowDiagram([
      [{t:'科举考试',note:'分科取士'}],
      [{t:'进士科',note:'诗赋策论'}],
      [{t:'录取为官',note:'文官政治基础'}]
    ],"科举制：以考试取代门第，社会流动渠道"),

    /* 元明清 */
    xingsheng: flowDiagram([
      [{t:'中书省',note:'总揽政务'}],
      [{t:'行中书省',note:'地方最高行政（行省）'}],
      [{t:'路·府·州·县',note:'层级管辖'}]
    ],"行省制度：今日省级行政区划的源头"),
    cabinet: flowDiagram([
      [{t:'皇帝',note:'废丞相·亲理政务'}],
      [{t:'内阁',note:'大学士辅政·票拟'}],
      [{t:'六部',note:'直接对皇帝负责'}]
    ],"明：废丞相设内阁，君主专制强化"),
    bannerSystem: flowDiagram([
      [{t:'八旗',note:'满洲军事社会组织'}],
      [{t:'满汉分治',note:'旗民分籍'}],
      [{t:'督抚',note:'地方军政长官'}]
    ],"清：满汉二元与部族政权特征"),

    /* 近代 */
    treatySystem: flowDiagram([
      [{t:'朝贡体系',note:'天朝上国·礼制秩序'}],
      [{t:'条约体系',note:'不平等条约·主权丧失'}],
      [{t:'半殖民地半封建',note:'多种解释并存'}]
    ],"晚清：从朝贡体系到条约体系的冲击")
  }
};
