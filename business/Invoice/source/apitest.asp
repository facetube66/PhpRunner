<%
%>
<!--#include file="include/dbcommon.asp"-->
<%
url = "https://yourwebsite.com/invoice/invoices_add.php"
set res = CreateDictionary()
set parameters = CreateDictionary()
set headers = CreateDictionary()
res("company_name") = "Company Name"
res("seller_info") = "Seller Info"
res("buyer_info") = "buyer name"
res("buyer_address") = "buyer address"
res("buyer_email") = "buyer@email.com"
res("tax") = "10"
res("terms") = "terms"
res("invoice_name") = "Invoice Name"
Set res("details") = CreateDictionary()
i = 1
do while IsLess(i,3)
	Set details = (CreateDictionary())
	details("item") = "item_" & CSmartStr(i)
	setArrElement details,"price",i
	setArrElement details,"quantity",i
	setArrElementN res,CreateArray2("details",empty),details
	i = CSmartDbl(i)+1
loop
doAssignmentByRef str,my_json_encode(res)
setArrElement parameters,"invoice",str
headers("auth") = "your Authenticate key"
doAssignmentByRef res,runner_post_request(url,parameters,headers,false)

if bValue(ArrayElement(res,"error")) then
	ResponseWrite ArrayElement(res,"error")
else
	if asp_strpos(res("content"),"http",0)<>"False" then
		ResponseWrite ("<a href='" & CSmartStr(ArrayElement(res,"content"))) & "'>Invoice view</a>"
	else
		ResponseWrite ArrayElement(res,"content")
	end if
end if
%>
