/*
  Warnings:

  - Added the required column `status` to the `type_service_list` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `type_service_list` ADD COLUMN `status` ENUM('ON', 'OFF') NOT NULL;
