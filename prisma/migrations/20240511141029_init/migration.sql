-- DropForeignKey
ALTER TABLE `RequiredServices` DROP FOREIGN KEY `RequiredServices_typeServiceId_fkey`;

-- AlterTable
ALTER TABLE `RequiredServices` ADD COLUMN `typeServiceListId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `RequiredServices` ADD CONSTRAINT `RequiredServices_typeServiceId_fkey` FOREIGN KEY (`typeServiceId`) REFERENCES `ServiceList`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequiredServices` ADD CONSTRAINT `RequiredServices_typeServiceListId_fkey` FOREIGN KEY (`typeServiceListId`) REFERENCES `TypeServiceList`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
