<?php
interface Models_Archive_Savable extends Models_Archive_Archivable
{
	public function getArchiveAlias();
	public function buildArchiveData();
}