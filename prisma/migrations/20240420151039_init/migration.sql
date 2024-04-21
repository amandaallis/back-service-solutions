/*
  Warnings:

  - Added the required column `typeProvider` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Provider` ADD COLUMN `typeProvider` VARCHAR(191) NOT NULL;
