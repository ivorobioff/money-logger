<?php
/**
 * @author Igor Vorobioff<i_am_vib@yahoo.com>
 */
class Libs_JsComposer
{
	private $_bootstrap;
	private $_config;

	private $_classes = array();

	public function __construct()
	{
		$this->_config = Libs_Config::getCustom('js_composer');
	}

	public function setBootstrap($filename)
	{
		$this->_bootstrap = $this->_config['app_path'].'/bootstrap/'.$filename;
		return $this;
	}

	public function process()
	{
		$classes = $this->_getBootstrapClasses();
		$this->_loadClasses($classes);

		return $this;
	}

	public function save()
	{
		$this->_classes = array_reverse($this->_classes);

		$result = '';

		foreach ($this->_classes as $class)
		{
			$result .= $this->_getFileContentByClass($class)."\n";
		}

		if (file_put_contents($this->_getResultFilePath(), $result) === false)
		{
			throw new Libs_JsComposer_Exceptions_ErrorSave('Can\' save file "'.$this->_getResultFilePath().'"');
		}
	}

	public function getWebPath()
	{
		return $this->_config['web_path'].'/'.$this->_getResultFileName();
	}

	private function _getBootstrapClasses()
	{
		if (!is_readable($this->_bootstrap))
		{
			throw new Libs_JsComposer_Exceptions_WrongBootstrap('Bootstrap is not readable: "'.$this->_bootstrap.'"');
		}

		$bootstrap_content = file_get_contents($this->_bootstrap);

		if ($bootstrap_content === false)
		{
			throw new Libs_JsComposer_Exceptions_WrongBootstrap('Can\'t load a bootstrap file: "'.$this->_bootstrap.'"');
		}

		if (!$bootstrap_classes = $this->_parseHeader($bootstrap_content))
		{
			throw new Libs_JsComposer_Exceptions_WrongBootstrap('The bootstrap header is empty: "'.$this->_bootstrap.'"');
		}

		return $bootstrap_classes;
	}

	private function _getResultFilePath()
	{
		return $this->_config['app_path'].'/bin/'.$this->_getResultFileName();
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

	private function _getResultFileName()
	{
		return md5(rtrim($this->_bootstrap, '.js')).'.js';
	}
}