"use strict";
/*jshint browser: true, node: false, jquery: true */
/*  */
exports.name= 'signature_pad_plugin'; 
var sst;          

var unpack_elements = function (cx,attr) {
	//decodes the content sent by the 'repack' function used in an element
    cx.f = {};
    if (attr !== undefined) {        
        var jsonobj = '{' + attr + '}';
        try {
            cx.f = JSON.parse(jsonobj);
        } catch (e) {
            console.log('unpack_elements failed:', e);
        }
        //console.log('cx.obj.Data.pick vals:',cx.f);
    }
}                


exports.init_client_plugin_mt_functions = function (obj,ss_tmpl) {     
    //console.log('filling client side plugin :',obj);
    sst=ss_tmpl;
    obj.SignaturepadFn = function ( ctx, _) {
               //_ is the current context dom object
				//console.log('obj.Data.upload:',ctx[0].Session,this,ctx,ctx[0]);
                //console.log('obj.Data.upload:',ths[0],ctx,ctx[0]);
                var ths=this;
                //ths is a array of the parameters passed from the element fragment
                //   first is normally the text content of the field
                //   second is a field (sub)type 
                //    [4] is attributes passed in f.
                //console.log('obj.Data.upload fn:');
                //console.log('obj.Data.upload _:');
                //console.log('obj.Data.upload ths[0]:',ths);
				var lcx = {},retval='';
                
				var items = ths[0].split(",");
				if (ths[0] === "")
					items = [];
                unpack_elements(lcx,ths[4]);
                lcx.Session=ctx[0].Session;
				//console.log('lobj.Data.pick obj:',qq_session,qq_Stash);

				lcx.par = ths;
                //console.log('Widgets-Uploader(',lcx);
                if (sst) //redbin: client side plugins cannot server side render client side hogans - mark 194901
				   retval = sst['Widgets-SignaturePad' ].render(lcx);
                   else {retval = 'redbin: client side plugins cannot server side render client side hogans - mark 194901 ';
                   console.log(retval);
                   }
				//console.log("new Option:",SelTxt,SelVal,toSel.options[toSel.length-1]);
				

				//console.log("new uploader:",retval);
				return retval;
			};	
	
	
}  


exports.init_after_render = function (Target) {     
	signature_pad_init();
}

