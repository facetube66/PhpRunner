<?php
function setEditId($id)
{
	$_GET["editid1"] = $id;	
}

function set_pdfButtonAttrs()
{
	return "onclick=\"window.scrollTo(0,0); $('.pdflink').click(); return false;\"";
}

function makeAdditionalPdfPreparations($xtempl, $pageObject)
{
/*##if @ext=="aspx"##
	if (postvalue("mvcPDF"))
	{
		$xtempl->assign("buttons-container", false);
		$pageObject->AddCSSFile("invoice/css/pdf.css");
	}
##endif##*/
}

function isSandbox(){
	$sql = "select * from invsettings";
	$rs = DB::Query($sql);
	$data = $rs->fetchAssoc();
	$sb = $data["ppSandbox"];
	if($sb)
		return true;
	else
		return false;
	
}
?>