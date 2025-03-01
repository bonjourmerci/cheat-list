CREATE TABLE `infidelity_testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`author_username` text NOT NULL,
	`cheater_username` text NOT NULL,
	`story` text NOT NULL,
	`proof_path` text,
	`created_at` integer NOT NULL
);
