# sql-mvc-signature-pad
Signature UI plugin for sql-mvc


First module to be totally split from core.


Used in conjunction with SQL-MVC

https://github.com/quale-quest/sql-mvc and https://www.npmjs.com/package/sql-mvc


Installing
	Add to package.json

Example of use
	simply use the class `as:signaturepad` in a singleton `tablestyle:"Nontable"` table or form 
	
~~~~~~~~
table
Select  --:{Title:"pictures",from:"GALLERY",tablestyle:"Nontable"}
first 1
REF	    --:{}
,BLOB_ID --:{as:signaturepad,Action:Edit}
From GALLERY 
where blob_id is null  and IMAGE_TYPE='Sign' 	
~~~~~~~~

