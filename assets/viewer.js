(async()=>{
 try{const[n,tx]=dec(location.hash.slice(3)),c=await render(n,tx),p=$('#vc');
  p.width=c.width;p.height=c.height;p.getContext('2d').drawImage(c,0,0);document.title='Certificate - '+n;$('#who').textContent=n;
  $('#vp').onclick=()=>dl(pdfOf(c),`Certificate - ${n}.pdf`);$('#vi').onclick=async()=>dl(await blobOf(c),`Certificate - ${n}.png`)}
 catch(e){$('#card').hidden=true;$('#err').hidden=false}
})();
