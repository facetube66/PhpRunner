using System;
using System.IO;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using System.Web;
using System.Net;
using System.Reflection;
using System.Collections.Specialized;

//This API allows to create an invoice sending buyer and seller data and also a list of items, prices, taxes etc. 
//If invoice is created successfully it returns URL of the View page of this invoice.

namespace runnerDotNet
{
	public partial class GlobalController : BaseController
	{
		public void apitest()
		{
			string _param_url = "https://yourwebsite.com/invoice/invoices_add.php";
			string auth = "your Authenticate key";
			Encoding enc8 = Encoding.UTF8;
			Dictionary<string, string> _param_parameters = new Dictionary<string, string>();

			System.Net.ServicePointManager.SecurityProtocol = (SecurityProtocolType)(3072 | 768);
			Dictionary<string, string> result = new Dictionary<string, string>();
			WebClient wc = new WebClient();
			var URI = new Uri(_param_url.ToString());
			NameValueCollection data = new NameValueCollection();
			data["invoice"] = "{'company_name':'Company Name','seller_info':'Seller Info','buyer_info':'buyer name','buyer_address':'buyer address','buyer_email':'buyer@email.com','tax':'10','terms':'terms','invoice_name':'Invoice Name','details':[{'item':'item_1','price':1,'quantity':1},{'item':'item_2','price':2,'quantity':2}]}";
			wc.Headers.Add("auth",auth);
			byte[] responseArray = wc.UploadValues(URI,data);
			Response.Write(enc8.GetString(responseArray));
		}
	}
}

