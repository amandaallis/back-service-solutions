/*
  Warnings:

  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeServiceList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TypeServiceList` DROP FOREIGN KEY `TypeServiceList_providerId_fkey`;

-- DropTable
DROP TABLE `Provider`;

-- DropTable
DROP TABLE `TypeServiceList`;

-- CreateTable
CREATE TABLE `type_service_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameService` VARCHAR(191) NOT NULL,
    `providerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_id` INTEGER NOT NULL,
    `requester_id` INTEGER NOT NULL,
    `number` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `type_service_list` ADD CONSTRAINT `type_service_list_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `provider`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adress` ADD CONSTRAINT `adress_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `provider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adress` ADD CONSTRAINT `adress_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `requester`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
