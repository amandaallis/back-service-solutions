/*
  Warnings:

  - You are about to drop the column `cpf` on the `ProviderPersonal` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Requester` table. All the data in the column will be lost.
  - Added the required column `city` to the `Requester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProviderPersonal` DROP COLUMN `cpf`;

-- AlterTable
ALTER TABLE `Requester` DROP COLUMN `cpf`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL;
