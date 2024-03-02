/*
  Warnings:

  - You are about to drop the `_service_listTotype_service_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_service_listTotype_service_list` DROP FOREIGN KEY `_service_listTotype_service_list_A_fkey`;

-- DropForeignKey
ALTER TABLE `_service_listTotype_service_list` DROP FOREIGN KEY `_service_listTotype_service_list_B_fkey`;

-- AlterTable
ALTER TABLE `type_service_list` ADD COLUMN `serviceId` INTEGER NULL;

-- DropTable
DROP TABLE `_service_listTotype_service_list`;

-- AddForeignKey
ALTER TABLE `type_service_list` ADD CONSTRAINT `type_service_list_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service_list`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
