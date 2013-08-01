<?php
function pre($str)
{
	echo '<pre>';
	print_r($str);
	echo '</pre>';
}

function pred($str)
{
	pre($str);
	die();
}

function _t($alias)
{
	$alias = '/'.trim($alias, '/');

	include APP_DIR.'/i18n/ru.php';
	return always_set($i18n, $alias, $alias);
}

function _url($path)
{
	return $path;
}

function always_set($array, $key, $default = null)
{
	return isset($array[$key]) ? $array[$key] : $default;
}

function is_location($url)
{
	$url = trim($url, '/');
	$url = explode('/', $url);

	if (!isset($url[0]) || !isset($url[1])) return false;

	if ($url[1] == '*')
	{
		return $url[0] == $_GET['controller'];
	}

	return $url[0] == $_GET['controller'] && $url[1] == $_GET['action'];
}

function redirect($path)
{
	header('location: '._url($path));
	exit();
}

function is_auth()
{
	return Models_CurrentUser::getInstance()->isAuth();
}

function load_js($controller, $action)
{
	$bootstrap_name = strtolower($controller.($action != 'index' ? '_'.$action : ''));

	$composer = new Libs_JsComposer($bootstrap_name.'.js');

	if (Libs_Config::getCustom('is_production'))
	{
		return '<script src="'.$composer->getJs().'"></script>';
	}

	try
	{
		$composer->process()->save();
	}
	catch (Libs_JsComposer_Exceptions_WrongBootstrap $ex)
	{
		return '';
	}

	return '<script src="'.$composer->getJs().'"></script>';
}