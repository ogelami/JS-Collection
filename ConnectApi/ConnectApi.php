<?php

class ConnectApiHandler
{
	private $allowedClasses;
	
	public function __construct()
	{
		$this->allowedClasses = array
		(
			'Pricewatcher' => dirname(__FILE__) . '/../ConnectApi/Pricewatcher.php'
		);
		
		foreach($this->allowedClasses as $class)
			if(!file_exists($class))
				throw new Exception('Class does not exist.');
	}
	
	private function getClass($classname)
	{
		if(isset($this->allowedClasses[$classname]) && !empty($this->allowedClasses[$classname]))
		{
			require_once($this->allowedClasses[$classname]);
			
			if(class_exists($classname))
				return new $classname;
		}
		
		return false;
	}
	
	public function request($requestData)
	{
		$options = isset($requestData['arguments']) ? (array)$requestData['arguments'] : array();
		$method  = $requestData['method'];
		$class   = $requestData['class'];
		$result  = 'empty';
		
		if(!($class = $this->getClass($class)))
			throw new Exception('Could not get class.');
		
		if(!is_subclass_of($class, 'ConnectApi'))
			throw new Exception('Class does not extend ConnectApi');
		
		if(!method_exists($class, $method) || !is_callable(array($class, $method)) || !$class->isCallable($method))
			throw new Exception('Cannot call method.');
		
		$result = call_user_func_array(array($class, $method), $options);
		
		switch($call['dataType'])
		{
	    	case 'jsonp':
	    		if(isset($_GET['callback']) & !empty($_GET['callback']))
	    		{
		    		$result = sprintf('%s(%s);', $_GET['callback'], json_encode($result));
		    	}
		    	break;
		    	
		    default:
		    	$result = json_encode($result);
	    }
	    
	    return $result;
	}
}

abstract class ConnectApi
{
	private $allowedMethods = array();
	
	protected function allowMethod($method)
	{
		if(is_array($method))
			$this->allowedMethods = array_merge($this->allowedMethods, $method);
		else if(is_string($method))
			$this->allowedMethods []= $method;
		else
			throw new Exception('Argument method of invalid type.');
		
		$this->allowedMethods = array_unique($this->allowedMethods);
	}
	
	public function isCallable($methodName)
	{
		return in_array($methodName, $this->allowedMethods);
	}
}

if ($_SERVER['SCRIPT_FILENAME'] == __FILE__)
{
	header('Content-Type: application/json');
	
	if(isset($_REQUEST['call']) && !empty($_REQUEST['call']))
	{
		try
		{
			$connectApiHandler = new ConnectApiHandler();
			
			$requestData = json_decode(base64_decode($_REQUEST['call']), true);
			
			echo $connectApiHandler->request($requestData);
		}
		catch(Exception $exception)
		{
			echo sprintf("%s\n%s\n\n", $exception->getMessage(), $exception->getTraceAsString());
		}
	}
}