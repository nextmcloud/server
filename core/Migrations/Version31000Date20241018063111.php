<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OC\Core\Migrations;

use Closure;
use Doctrine\DBAL\Types\Types;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\Attributes\AddColumn;
use OCP\Migration\Attributes\AddIndex;
use OCP\Migration\Attributes\ColumnType;
use OCP\Migration\Attributes\IndexType;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Add objecttype index to systemtag_object_mapping
 */
#[AddColumn(table: 'systemtag', name: 'etag', type: ColumnType::STRING, description: 'Adding etag for systemtag table to prevent conflicts')]
#[AddIndex(table: 'systemtag_object_mapping', type: IndexType::INDEX, description: 'Adding objecttype index to systemtag_object_mapping')]
class Version31000Date20241018063111 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure(): ISchemaWrapper $schemaClosure
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('systemtag_object_mapping')) {
			$table = $schema->getTable('systemtag_object_mapping');

			if (!$table->hasIndex('systag_objecttype')) {
				$table->addIndex(['objecttype'], 'systag_objecttype');
			}
		}

		if ($schema->hasTable('systemtag')) {
			$table = $schema->getTable('systemtag');

			if (!$table->hasColumn('etag')) {
				$table->addColumn('etag', Types::STRING, [
					'notnull' => false,
					'length' => 32,
				]);
			}
		}

		return $schema;
	}
}
