function ConnectApi(_class, method, _arguments, callback, options)
{
	if(typeof method !== 'string')
		return false;
		
	if(typeof _class !== 'string')
		return false;
	
	var data = 
	{
		'method' : method,
		'class'  : _class,
		dataType : (typeof options !== 'undefined' && typeof options.dataType !== 'undefined' ? options.dataType : 'json' )
	};
	
	if(typeof _arguments !== 'undefined')
		data = $.extend(data, { arguments : _arguments });
	
	var result = '';
	
	var ajaxOptions =
	{
		async    : (typeof callback !== 'undefined'),
		type     : "POST",
		url      : "/_ajax/ConnectApiHandler.php",
		success  : (typeof callback !== 'undefined') ? callback : function(data){ result = data; },
		error    : function()
		{
			console.log([data, ajaxOptions, arguments]);
		},
		data     :
		{
			call : Base64.encode(JSON.stringify(data))
		},
		dataType: data.dataType
	};
	
	if(typeof options === 'object')
		ajaxOptions = $.extend(ajaxOptions, options);
	
	$ajaxObject = $.ajax(ajaxOptions);
	
//	console.log(data);
//	console.log(ajaxOptions);
//	console.log($ajaxObject);
	
	if(typeof callback !== 'undefined')
		return $ajaxObject;
	
	return result;
}