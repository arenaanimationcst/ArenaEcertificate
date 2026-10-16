const $=s=>document.querySelector(s);
const ASSETS=new URL('.',document.currentScript.src).href;
const bgImg=new Image(),bgReady=new Promise(r=>{bgImg.onload=r});bgImg.src=ASSETS+'bg.jpg';
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const dec=v=>JSON.parse(decodeURIComponent(escape(atob(v.replace(/-/g,'+').replace(/_/g,'/')))));
const pdfOf=c=>{const d=new jspdf.jsPDF({orientation:'landscape',unit:'pt',format:[792,612]});d.addImage(c.toDataURL('image/jpeg',.95),'JPEG',0,0,792,612);return d.output('blob')};
async function render(name,text){
 const L=f=>document.fonts.load(f).catch(()=>{});await Promise.all([L('47px "Great Vibes"'),L('12px "Funnel Display"'),L('700 12px "Funnel Display"'),bgReady]);
 const k=2.5,c=document.createElement('canvas');c.width=792*k;c.height=612*k;const x=c.getContext('2d');
 x.drawImage(bgImg,-29.176*k,0,838.5*k,612*k);
 let fs=47;x.fillStyle='#990000';x.textAlign='center';x.font=`${fs*k}px "Great Vibes"`;name=name||'Student Name';
 while(x.measureText(name).width>520*k&&fs>18){fs--;x.font=`${fs*k}px "Great Vibes"`}
 x.fillText(name,396*k,378.5*k);
 x.fillStyle='#000';x.textAlign='left';
 const fnt=(b,f)=>`${b?'700 ':''}${f*k}px "Funnel Display"`,W=640*k,sw=f=>(x.font=fnt(0,f),x.measureText(' ').width);
 const paras=text.split('\n').map(p=>{const P=p.split('**');return P.flatMap((seg,i)=>{const ws=seg.split(/\s+/);return ws.map((w,j)=>w&&[w,i%2,j==0&&i>0&&!/^\s/.test(seg)&&!/\s$/.test(P[i-1])?1:0]).filter(Boolean)})});
 let f=12,lines;
 for(;;){const sp=sw(f);lines=[];
  paras.forEach(p=>{let ln=[],w=0;p.forEach(([t,b,g])=>{x.font=fnt(b,f);const tw=x.measureText(t).width;if(ln.length&&!g&&w+sp+tw>W){lines.push([ln,w]);ln=[];w=0}w+=(ln.length&&!g?sp:0)+tw;ln.push([t,b,tw,g])});lines.push([ln,w])});
  if(432.7+(lines.length-1)*f*1.44<=502||f<=7)break;f-=.25}
 const sp=sw(f);
 lines.forEach(([ln,w],i)=>{let px=396*k-w/2;ln.forEach(([t,b,tw,g],j)=>{if(j&&!g)px+=sp;x.font=fnt(b,f);x.fillText(t,px,(432.7+i*f*1.44)*k);px+=tw})});
 return c}
const blobOf=c=>new Promise(r=>c.toBlob(r,'image/png'));
function dl(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
const DEFBODY="This certificate is proudly awarded for active participation in the AVGC Career Guidance Seminar organized by Arena Animation, reflecting a keen interest in exploring the fields of Animation, Visual Effects (VFX), Gaming, and Comics, and gaining valuable insights for future professional development.\nThe seminar was held at **{{college}}** on **{{date}}**";
const AIBODY="This certificate is proudly awarded for active participation in the Workshop on AVGC & Artificial Intelligence (AI) organized by Arena Animation CST, recognizing an enthusiastic interest in exploring the fields of Animation, Visual Effects (VFX), Gaming, Comics, and the emerging applications of AI in creative industries.\nThe workshop was held at **{{college}}** on **{{date}}**.";
const fmt=v=>{if(!v)return'';const d=new Date(v+'T00:00:00'),n=d.getDate(),o=n%10==1&&n!=11?'st':n%10==2&&n!=12?'nd':n%10==3&&n!=13?'rd':'th';return n+o+' '+d.toLocaleDateString('en-GB',{month:'long',year:'numeric'})};
const PRESETS={1:DEFBODY,2:AIBODY};
const bodyFrom=(t,college,date)=>t.replace(/{{college}}/g,college||'your college').replace(/{{date}}/g,fmt(date)||'the seminar date');
