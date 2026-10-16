(async()=>{
 try{const h=location.hash;let n,tx;
  if(h.startsWith('#c=')){const[a,c,d,b]=h.slice(3).split('~').map(v=>decodeURIComponent(v.replace(/\+/g,'%20')));
   if(!a)throw 0;n=a;tx=bodyFrom(PRESETS[b]||b,c,/^\d{8}$/.test(d)?`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6)}`:'')}
  else[n,tx]=dec(h.slice(3));
  const c=await render(n,tx),p=$('#vc');
  p.width=c.width;p.height=c.height;p.getContext('2d').drawImage(c,0,0);document.title='Certificate - '+n;$('#who').textContent=n;
  $('#vp').onclick=()=>dl(pdfOf(c),`Certificate - ${n}.pdf`);$('#vi').onclick=async()=>dl(await blobOf(c),`Certificate - ${n}.png`)}
 catch(e){$('#card').hidden=true;$('#err').hidden=false}
})();
