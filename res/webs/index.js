setTimeout(function() {
    window.postMessage(JSON.stringify({type:'hhhh',data:'123'}));
}, 1000);

document.addEventListener('message', function(e) {
    var p = document.createElement('p');
    var t = document.createTextNode(e.data);
    p.appendChild(t);
    document.body.appendChild(p);
});
