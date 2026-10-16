const KEY='arenaCert1';
const DEF="Hello {{name}}, thank you for attending the session at {{college}} on {{date}}. Here is your Certificate of Participation from Arena Animation C.S.T.";
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{seminars:[],cur:null},openId=null,tm;
const save=()=>localStorage.setItem(KEY,JSON.stringify(S)),cur=()=>S.seminars.find(s=>s.id===S.cur);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(t){const e=$('#toast');e.textContent=t;e.style.display='block';clearTimeout(tm);tm=setTimeout(()=>e.style.display='none',5000)}
function newSem(){const s={id:uid(),college:'',date:new Date().toISOString().slice(0,10),msg:DEF,students:[]};S.seminars.unshift(s);S.cur=s.id;save();draw()}
const phone=p=>{p=String(p||'').replace(/\D/g,'');if(p.length==10)return'91'+p;if(p.length==11&&p[0]=='0')return'91'+p.slice(1);return p};
const opt=()=>S.opts||(S.opts={attach:1,link:1});
const msgOf=(st,s)=>{let t=s.msg,L=linkFor(st.name,s);
 if(opt().link)t=t.includes('{{link}}')?t.replace(/{{link}}/g,L):t.replace(/\s+$/,'')+'\nDownload your certificate: '+L;
 else t=t.split('\n').filter(l=>!l.includes('{{link}}')).join('\n');
 return fill(t,st,s)};
const fill=(t,st,s)=>t.replace(/{{name}}/g,st.name).replace(/{{college}}/g,s.college||'our college').replace(/{{date}}/g,fmt(s.date)).replace(/{{link}}/g,linkFor(st.name,s));
const bodyOf=s=>bodyFrom(s.body||DEFBODY,s.college,s.date);
const E=v=>encodeURIComponent(v).replace(/%20/g,'+');
const linkFor=(n,s)=>{if(location.protocol=='file:')return'(link works once this page is hosted online)';const t=s.body||DEFBODY,b=t===DEFBODY?'1':t===AIBODY?'2':t;
 return new URL('../c/',location.href).href+'#c='+[n,s.college,(s.date||'').replace(/-/g,''),b].map(E).join('~')};
const R=(n,s=cur())=>render(n,bodyOf(s));
function mark(st){st.sent=Date.now();save();draw()}

async function sendSt(c){
 const s=cur();if(!c.phone)return toast('Add a WhatsApp number first.');
 const num=c.phone.length==12&&c.phone.startsWith('91')?c.phone.slice(2):c.phone,share=opt().attach;
 if(share)navigator.clipboard.writeText(num).catch(()=>{});
 const cv=await R(c.name,s),pdf=new File([pdfOf(cv)],`Certificate - ${c.name}.pdf`,{type:'application/pdf'}),msg=msgOf(c,s),done=()=>{const st=c.id&&s.students.find(z=>z.id===c.id);if(st)mark(st)};
 if(share&&navigator.canShare&&navigator.canShare({files:[pdf]})){
  toast(`Number ${num} copied. In WhatsApp press Ctrl+V in the contact search, pick the chat, then Send.`);
  try{await navigator.share({files:[pdf],text:msg});done();return}catch(e){if(e.name=='AbortError')return}}
 let ok=1;try{await navigator.clipboard.write([new ClipboardItem({'image/png':await blobOf(cv)})])}catch(e){ok=0}
 window.open(`https://wa.me/${c.phone}?text=${encodeURIComponent(msg)}`,'_blank');done();
 toast((share?'File sharing is not available on this device, so the chat was opened instead. ':'')+(ok?'Certificate image copied: click the message box, press Ctrl+V, then Send. ':'')+(/#[cv]=/.test(msg)?'The link in the message lets the student download the PDF.':'Use Download PDF to attach the file.'))}
const send=id=>sendSt({...cur().students.find(z=>z.id===id)});

let liveId=null,lt;
const live=()=>{clearTimeout(lt);lt=setTimeout(async()=>{const s=cur(),c=await R($('#ln').value.trim()),p=$('#lv');p.width=c.width;p.height=c.height;p.getContext('2d').drawImage(c,0,0)},120)};
function openStudent(id){liveId=id;const st=cur().students.find(z=>z.id===id);$('#ln').value=st.name;$('#lp').value=st.phone;live();$('#live').scrollIntoView({behavior:'smooth'})}

function addStudents(list){const s=cur();let n=0;
 list.forEach(([name,ph])=>{name=String(name||'').trim();ph=phone(ph);if(!name)return;
  if(s.students.some(z=>z.name.toLowerCase()==name.toLowerCase()&&z.phone==ph))return;
  s.students.push({id:uid(),name,phone:ph,sent:0});n++});
 save();draw();toast(`${n} added${list.length-n?`, ${list.length-n} skipped (duplicate or blank)`:''}.`)}
$('#addBtn').onclick=()=>{const l=$('#paste').value.split('\n').map(t=>t.trim()).filter(Boolean).map(t=>{const m=t.match(/^(.*?)[,\t;|\s]+(\+?[\d\s-]{8,})$/);return m?[m[1].replace(/[,;|]+$/,''),m[2]]:[t,'']});addStudents(l);$('#paste').value=''};
$('#xl').onchange=async e=>{const f=e.target.files[0];if(!f)return;const wb=XLSX.read(await f.arrayBuffer()),rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1});
 addStudents(rows.map(r=>{r=r.map(v=>String(v??'').trim());const ph=r.find(v=>v.replace(/\D/g,'').length>=10),nm=r.find(v=>v&&!/^[\d\s+()-]+$/.test(v));return/^(name|student)/i.test(nm||'')&&!ph?null:[nm,ph]}).filter(Boolean));e.target.value=''};

function draw(){
 if(!S.seminars.length)return newSem();if(!cur())S.cur=S.seminars[0].id;const s=cur();
 $('#semSel').innerHTML=S.seminars.map(z=>`<option value="${z.id}"${z.id==S.cur?' selected':''}>${esc(z.college||'Untitled seminar')}${z.date?' on '+fmt(z.date):''}</option>`).join('');
 if(document.activeElement.id!='college')$('#college').value=s.college;$('#date').value=s.date;if(document.activeElement.id!='msg')$('#msg').value=s.msg;if(document.activeElement.id!='body')$('#body').value=s.body||DEFBODY;
 const q=$('#q').value.toLowerCase(),sent=s.students.filter(z=>z.sent).length,L=s.students.filter(z=>(z.name+z.phone).toLowerCase().includes(q));
 $('#oAtt').checked=!!opt().attach;$('#oLnk').checked=!!opt().link;$('#cnt').textContent=`${s.students.length} students, ${sent} sent`;
 $('#rows').innerHTML=L.length?L.map(z=>`<div class="st"><div><button class="nm" data-a="open" data-i="${z.id}">${esc(z.name)}</button><div class="ph">${z.phone?'+'+z.phone:'no number'}</div></div>
 <button class="pill${z.sent?' sent':''}" data-a="tog" data-i="${z.id}" style="border:0;cursor:pointer" title="Click to toggle">${z.sent?'Sent '+new Date(z.sent).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'Pending'}</button>
 <button data-a="send" data-i="${z.id}">Send</button><button class="x" data-a="del" data-i="${z.id}" aria-label="Remove ${esc(z.name)}">x</button></div>`).join(''):'<div class="empty">No students yet. Paste names and numbers, or upload a sheet.</div>';live()}
$('#rows').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const s=cur(),i=b.dataset.i,st=s.students.find(z=>z.id==i);
 ({open:()=>openStudent(i),send:()=>send(i),tog:()=>{st.sent=st.sent?0:Date.now();save();draw()},del:()=>{if(confirm('Remove '+st.name+'?')){s.students=s.students.filter(z=>z.id!=i);save();draw()}}})[b.dataset.a]()};
$('#q').oninput=draw;$('#newSem').onclick=newSem;$('#semSel').onchange=e=>{S.cur=e.target.value;save();draw()};
$('#college').oninput=e=>{cur().college=e.target.value;save();live();$('#semSel').selectedOptions[0].textContent=e.target.value||'Untitled seminar'};
$('#date').onchange=e=>{cur().date=e.target.value;save();draw()};$('#msg').oninput=e=>{cur().msg=e.target.value;save()};
$('#delSem').onclick=()=>{if(confirm('Delete this seminar and its student list?')){S.seminars=S.seminars.filter(z=>z.id!=S.cur);S.cur=null;save();draw()}};
$('#exp').onclick=()=>dl(new Blob([JSON.stringify(S)],{type:'application/json'}),'certificate-desk-backup.json');
$('#imp').onchange=async e=>{try{S=JSON.parse(await e.target.files[0].text());save();draw();toast('Backup restored.')}catch(x){toast('That file could not be read.')}};
$('#body').oninput=e=>{cur().body=e.target.value;save();live()};
$('#p1').onclick=()=>{cur().body=DEFBODY;save();draw()};$('#p2').onclick=()=>{cur().body=AIBODY;save();draw()};
$('#lpdf').onclick=async()=>{const n=$('#ln').value.trim()||'Student';dl(pdfOf(await R(n)),`Certificate - ${n}.pdf`)};
const cs=()=>({id:liveId,name:$('#ln').value.trim(),phone:phone($('#lp').value)});
$('#ln').oninput=()=>{liveId=null;live()};
$('#lsend').onclick=()=>{const c=cs();if(!c.name)return toast('Type a name first.');sendSt(c)};
$('#ldl').onclick=async()=>{const s=cur(),n=$('#ln').value.trim()||'Student';dl(await blobOf(await R(n)),`Certificate - ${n}.png`)};
$('#ladd').onclick=()=>{const c=cs();if(!c.name)return toast('Type a name first.');addStudents([[c.name,$('#lp').value]]);$('#ln').value='';$('#lp').value='';liveId=null;live()};
$('#oAtt').onchange=e=>{opt().attach=e.target.checked?1:0;save()};$('#oLnk').onchange=e=>{opt().link=e.target.checked?1:0;save()};
$('#smp').onclick=()=>{const ws=XLSX.utils.aoa_to_sheet([['Name','Phone'],['Rahul Sharma','9876543210'],['Priya Patil','9123456780'],['Aman Khan','9000000001']]);ws['!cols']=[{wch:26},{wch:16}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Students');XLSX.writeFile(wb,'Students-Sample.xlsx')};
draw();
