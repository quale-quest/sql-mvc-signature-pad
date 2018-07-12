
var signature_pad = {};
// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function signature_pad_resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  var ratio =  Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  signature_pad.canvas.width = signature_pad.canvas.offsetWidth * ratio;
  signature_pad.canvas.height = signature_pad.canvas.offsetHeight * ratio;
  signature_pad.canvas.getContext("2d").scale(ratio, ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  signature_pad.signaturePad.clear();
  signature_pad.savePNGButton.disabled = true;
}


function signature_pad_download(dataURL, filename) {
  var blob = signature_pad_dataURLToBlob(dataURL);
  var url = window.URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function signature_pad_dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}



function signature_pad_init(DownloadOrUpload) {
	signature_pad.DownloadOrUpload = DownloadOrUpload||'Upload';
	signature_pad_wrapper = document.getElementById("signature-pad");
	signature_pad.clearButton = signature_pad_wrapper.querySelector("[data-action=clear]");
	signature_pad.savePNGButton = signature_pad_wrapper.querySelector("[data-action=save-png]");
	signature_pad.canvas = signature_pad_wrapper.querySelector("canvas");
	signature_pad.signaturePad = new SignaturePad(signature_pad.canvas,{},function () {
		signature_pad.savePNGButton.disabled = false;	
	});
	

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = signature_pad_resizeCanvas;
signature_pad_resizeCanvas();



signature_pad.clearButton.addEventListener("click", function (event) {
  signature_pad.savePNGButton.disabled = true;
  signature_pad.signaturePad.clear();
});


signature_pad.savePNGButton.addEventListener("click", function (event) {
  signature_pad.savePNGButton.disabled = true;
 
  //console.log("savePNGButton  pkf:",document.getElementById('signature-pad').getAttribute("data-pkf"));
  //console.log("savePNGButton  pko:",document.getElementById('signature-pad').getAttribute("data-pko"));

  pkf=String(+document.getElementById('signature-pad').getAttribute("data-pkf") + (+document.getElementById('signature-pad').getAttribute("data-pko")));
  var Cell=FindCell(signature_pad.savePNGButton,pkf);

  Cell.pkf = pkf;  
  var el=Cell.el;
  delete Cell.el;
  //console.log("savePNGButton : ",Cell,el);  
  
  if (signature_pad.signaturePad.isEmpty()) {
    console.log("Please provide a signature first.");
  } else {
    var img = signature_pad.signaturePad.toDataURL();
	if (signature_pad.DownloadOrUpload=='Download') { //save local
		signature_pad_download(img, "signature.png");
	} else { //save on server
		//signature_pad_download(dataURL, "signature.png");
		//console.log('savePNGButton :  :ajax');	
		$.ajax({
			type: "POST",
			url: "/upload",
			
			data: {
				session: qq_session, 
				cid:Cell.cid, 
				pkf:Cell.pkf,
				dbid:"xxx",
				filecontent: img				
				},
			success: function(return_data)	{				
				console.log('savePNGButton : success :',return_data);					
				//todo better handle 'File To Large' error sent from app_uploads.js - for now simply alert
				if (return_data=='{"message": "File To Large"}' )alert("File To Large");
			}

		});
	
  } //else save on server
  } //else empty
  //signature_pad.savePNGButton.disabled = false;
});

}


