-- CreateTable
CREATE TABLE `service_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_service_listTotype_service_list` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_service_listTotype_service_list_AB_unique`(`A`, `B`),
    INDEX `_service_listTotype_service_list_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_service_listTotype_service_list` ADD CONSTRAINT `_service_listTotype_service_list_A_fkey` FOREIGN KEY (`A`) REFERENCES `service_list`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_service_listTotype_service_list` ADD CONSTRAINT `_service_listTotype_service_list_B_fkey` FOREIGN KEY (`B`) REFERENCES `type_service_list`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
