/*
  Warnings:

  - You are about to drop the `type_service_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `type_service_list`;

-- CreateTable
CREATE TABLE `TypeServiceList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameService` VARCHAR(191) NOT NULL,
    `providerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TypeServiceList` ADD CONSTRAINT `TypeServiceList_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Provider`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
