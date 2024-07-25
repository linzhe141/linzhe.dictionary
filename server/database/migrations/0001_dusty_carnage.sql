CREATE TABLE `vocabulary_cheat_sheet` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word` text NOT NULL,
	`symbols` text,
	`trans` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wordUniqueIndex` ON `vocabulary_cheat_sheet` (lower("word"));