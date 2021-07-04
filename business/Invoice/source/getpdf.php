<?php 
@ini_set("display_errors","1");
@ini_set("display_startup_errors","1");

include("include/dbcommon.php");

$table = postvalue("table");
$id = postvalue("id");
if(!$table || !$id)
	return;

$tablename="";
$tables = GetTablesList(true);
foreach($tables as $t)
{
	if(GetTableURL($t)==$table)
	{
		$tablename=$t;
		break;
	}
}
if(!$tablename)
	return;
##if @BUILDER.bCreateLoginPage##
if(!isLogged())
{ 
	header("Location: login.php"); 
	return;
}
$strPerm = GetUserPermissions($tablename);
if(strpos($strPerm,"S")===false && strpos($strPerm,"E")===false)
{ 
	header("Location: login.php"); 
	return;
}
##endif##

$file = dirname(__FILE__)."/templates_c/".$table.$id.".pdf";
if(!myfile_exists($file))
	return;
$value = @file_get_contents($file);

$displayedName = $table;
if($_SESSION["invoicepr_inum"]){
	$displayedName = "Invoice".$_SESSION["invoicepr_inum"];
}

header("Content-Type: application/pdf");
if(!GetGlobalData("openPDFFileDirectly", true))
	header("Content-Disposition: attachment;Filename=\"".$displayedName.".pdf\"");
header("Cache-Control: private");
SendContentLength(strlen($value));
echoBinary($value);

?>