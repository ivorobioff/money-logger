<?php
interface Models_Archive_Interfaces_Savable extends Models_Archive_Interfaces_Archivable
{
	public function getArchiveAlias();
	public function buildArchiveData();
}