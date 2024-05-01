-- CreateTable
CREATE TABLE `RequiredServices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeServiceId` INTEGER NULL,
    `providerId` INTEGER NULL,
    `requesterId` INTEGER NULL,
    `adressId` INTEGER NULL,
    `requestedData` DATETIME(3) NOT NULL,
    `statusRequiredService` ENUM('APPROVED', 'REJECTED', 'REALIZED', 'OPEN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RequiredServices` ADD CONSTRAINT `RequiredServices_typeServiceId_fkey` FOREIGN KEY (`typeServiceId`) REFERENCES `TypeServiceList`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequiredServices` ADD CONSTRAINT `RequiredServices_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Provider`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequiredServices` ADD CONSTRAINT `RequiredServices_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `Requester`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequiredServices` ADD CONSTRAINT `RequiredServices_adressId_fkey` FOREIGN KEY (`adressId`) REFERENCES `Adress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
