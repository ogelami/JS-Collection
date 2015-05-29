<?

class Pricewatcher extends ConnectApi
{
	public function __construct()
	{
		$this->allowMethod(array('watch'));
	}
	
	public function watch($options, $token = false)
	{
		
		
		return $options;
	}
}