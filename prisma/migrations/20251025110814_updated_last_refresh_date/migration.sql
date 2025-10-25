-- AlterTable
ALTER TABLE `countries` MODIFY `last_refreshed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
