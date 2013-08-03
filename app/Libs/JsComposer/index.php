<?php
/**
 * @author Igor Vorobioff<i_am_vib@yahoo.com>
 */
class Libs_JsComposer
{
	private $_bootstraps = array();
	private $_config;

	private $_classes = array();

	/**
	 * @param string $filename - имя файла бутстрапа
	 */
	public function __construct()
	{
		$this->_config = Libs_Config::getCustom('js_composer');
	}

	public function addBootstrap($filename)
	{
		$this->_bootstraps[] = $filename;
		return $this;
	}

	public function process()
	{
		if (!$this->_bootstraps) throw new Libs_JsComposer_Exceptions_NoStart();

		$classes = array();

		foreach ($this->_bootstraps as $bootstrap)
		{
			$classes = array_merge($classes, $this->_getBootstrapClasses($bootstrap));
		}

		if (!$classes) throw new Libs_JsComposer_Exceptions_NoStart();

		$this->_loadClasses($classes);

		return $this;
	}

	public function save($filename)
	{
		$this->_classes = array_reverse($this->_classes);

		$result = '';

		foreach ($this->_classes as $class)
		{
			$result .= $this->_getFileContentByClass($class)."\n";
		}

		$path = $this->_config['bin_path'].'/'.$filename;

		if (file_put_contents($path, $result) === false)
		{
			throw new Libs_JsComposer_Exceptions_ErrorSave('Can\'t save file "'.$path.'"');
		}
	}


	private function _getBootstrapClasses($filename)
	{
		$path = $this->_config['app_path'].'/bootstrap/'.$filename;

		if (!is_readable($path)) return array() ;

		$content = file_get_contents($path);
		if ($content === false) return array();

		return $this->_parseHeader($content);
	}

	private function _loadClasses($classes)
	{
		$classes = array_unique($classes);

		foreach ($classes as $class)
		{
			$key_class = array_search($class, $this->_classes);

			if ($key_class !== false)
			{
				unset($this->_classes[$key_class]);
			}

			$this->_classes[] = $class;

			$content = $this->_getFileContentByClass($class);
			$parent_classes = $this->_parseHeader($content);

			if (!$parent_classes) continue ;

			$this->_loadClasses($parent_classes);
		}
	}

	private function _parseHeader($file)
	{
		$loads = array();

		$begin = strpos($file, '/**');
		$end = strpos($file, '*/');

		$header = substr($file, $begin, ($end - $begin) + 1);

		if (!preg_match_all('/@load [a-zA-Z\.]*/s', $header, $loads))
		{
			return array();
		}

		$loads = $loads[0];

		foreach ($loads as &$value)
		{
			$value = trim(ltrim($value, '@load'));
		}

		return $loads;

	}

	private function _getFileContentByClass($class)
	{
		$file = $this->_config['app_path'].'/'.str_replace('.', '/', $class).'.js';

		$content = file_get_contents($file);

		if ($content === false)
		{
			throw new Libs_JsComposer_Exceptions_WrongFile('Can\'t load class "'.$class.'"');
		}

		return $content;
	}
}