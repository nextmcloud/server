<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2021, Joas Schilling <coding@schilljs.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OC\Core\Command\Background;

use OCP\BackgroundJob\IJobList;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Job extends JobBase {
	public function __construct(IJobList $jobList,
								LoggerInterface $logger) {
		parent::__construct($jobList, $logger);
	}

	protected function configure(): void {
		$this
			->setName('background-job:execute')
			->setDescription('Execute a single background job manually')
			->addArgument(
				'job-id',
				InputArgument::REQUIRED,
				'The ID of the job in the database'
			)
			->addOption(
				'force-execute',
				null,
				InputOption::VALUE_NONE,
				'Force execute the background job, independent from last run and being reserved'
			)
		;
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$jobId = (int) $input->getArgument('job-id');

		$job = $this->jobList->getById($jobId);
		if ($job === null) {
			$output->writeln('<error>Job with ID ' . $jobId . ' could not be found in the database</error>');
			return 1;
		}

		$this->printJobInfo($jobId, $job, $output);
		$output->writeln('');

		$lastRun = $job->getLastRun();
		if ($input->getOption('force-execute')) {
			$lastRun = 0;
			$output->writeln('<comment>Forcing execution of the job</comment>');
			$output->writeln('');

			$this->jobList->resetBackgroundJob($job);
		}

		$job = $this->jobList->getById($jobId);
		if ($job === null) {
			$output->writeln('<error>Something went wrong when trying to retrieve Job with ID ' . $jobId . ' from database</error>');
			return 1;
		}
		$job->execute($this->jobList, \OC::$server->getLogger());
		$job = $this->jobList->getById($jobId);

		if (($job === null) || ($lastRun !== $job->getLastRun())) {
			$output->writeln('<info>Job executed!</info>');
			$output->writeln('');

			if ($job instanceof \OC\BackgroundJob\TimedJob || $job instanceof \OCP\BackgroundJob\TimedJob) {
				$this->printJobInfo($jobId, $job, $output);
			}
		} else {
			$output->writeln('<comment>Job was not executed because it is not due</comment>');
			$output->writeln('Specify the <question>--force-execute</question> option to run it anyway');
		}

		return 0;
	}
}
