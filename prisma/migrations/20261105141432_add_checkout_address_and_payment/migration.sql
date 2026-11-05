/*
  Warnings:

  - The primary key for the `assinaturas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `assinaturas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `usuarios_id` on the `assinaturas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `planos_id` on the `assinaturas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `eventos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `eventos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `participantes_eventos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `usuarios_id` on the `participantes_eventos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `eventos_id` on the `participantes_eventos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `pedidos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `pedidos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `usuarios_id` on the `pedidos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `pedidos_produtos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `pedidos_produtos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pedidos_id` on the `pedidos_produtos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `produtos_id` on the `pedidos_produtos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `planos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `planos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `planos_servicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `planos_id` on the `planos_servicos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `servicos_id` on the `planos_servicos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `produtos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `produtos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `profissionais` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `profissionais` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `usuarios_id` on the `profissionais` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `profissionais_servicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `profissionais_id` on the `profissionais_servicos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `servicos_id` on the `profissionais_servicos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `servicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `servicos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `formaPagamento` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assinaturas` DROP FOREIGN KEY `assinaturas_planos_id_fkey`;

-- DropForeignKey
ALTER TABLE `assinaturas` DROP FOREIGN KEY `assinaturas_usuarios_id_fkey`;

-- DropForeignKey
ALTER TABLE `participantes_eventos` DROP FOREIGN KEY `participantes_eventos_eventos_id_fkey`;

-- DropForeignKey
ALTER TABLE `participantes_eventos` DROP FOREIGN KEY `participantes_eventos_usuarios_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedidos` DROP FOREIGN KEY `pedidos_usuarios_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedidos_produtos` DROP FOREIGN KEY `pedidos_produtos_pedidos_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedidos_produtos` DROP FOREIGN KEY `pedidos_produtos_produtos_id_fkey`;

-- DropForeignKey
ALTER TABLE `planos_servicos` DROP FOREIGN KEY `planos_servicos_planos_id_fkey`;

-- DropForeignKey
ALTER TABLE `planos_servicos` DROP FOREIGN KEY `planos_servicos_servicos_id_fkey`;

-- DropForeignKey
ALTER TABLE `profissionais` DROP FOREIGN KEY `profissionais_usuarios_id_fkey`;

-- DropForeignKey
ALTER TABLE `profissionais_servicos` DROP FOREIGN KEY `profissionais_servicos_profissionais_id_fkey`;

-- DropForeignKey
ALTER TABLE `profissionais_servicos` DROP FOREIGN KEY `profissionais_servicos_servicos_id_fkey`;

-- DropIndex
DROP INDEX `planos_servicos_servicos_id_fkey` ON `planos_servicos`;

-- DropIndex
DROP INDEX `profissionais_servicos_servicos_id_fkey` ON `profissionais_servicos`;

-- AlterTable
ALTER TABLE `assinaturas` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `usuarios_id` INTEGER NOT NULL,
    MODIFY `planos_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `eventos` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `participantes_eventos` DROP PRIMARY KEY,
    MODIFY `usuarios_id` INTEGER NOT NULL,
    MODIFY `eventos_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`usuarios_id`, `eventos_id`);

-- AlterTable
ALTER TABLE `pedidos` DROP PRIMARY KEY,
    ADD COLUMN `formaPagamento` VARCHAR(20) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `usuarios_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pedidos_produtos` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `pedidos_id` INTEGER NOT NULL,
    MODIFY `produtos_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `planos` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `planos_servicos` DROP PRIMARY KEY,
    MODIFY `planos_id` INTEGER NOT NULL,
    MODIFY `servicos_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`planos_id`, `servicos_id`);

-- AlterTable
ALTER TABLE `produtos` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `profissionais` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `usuarios_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `profissionais_servicos` DROP PRIMARY KEY,
    MODIFY `profissionais_id` INTEGER NOT NULL,
    MODIFY `servicos_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`profissionais_id`, `servicos_id`);

-- AlterTable
ALTER TABLE `servicos` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `usuarios` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `pagamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `bandeira` VARCHAR(50) NOT NULL,
    `ultimosDigitos` VARCHAR(4) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pagamentos_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profissionais` ADD CONSTRAINT `profissionais_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profissionais_servicos` ADD CONSTRAINT `profissionais_servicos_profissionais_id_fkey` FOREIGN KEY (`profissionais_id`) REFERENCES `profissionais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profissionais_servicos` ADD CONSTRAINT `profissionais_servicos_servicos_id_fkey` FOREIGN KEY (`servicos_id`) REFERENCES `servicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planos_servicos` ADD CONSTRAINT `planos_servicos_planos_id_fkey` FOREIGN KEY (`planos_id`) REFERENCES `planos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planos_servicos` ADD CONSTRAINT `planos_servicos_servicos_id_fkey` FOREIGN KEY (`servicos_id`) REFERENCES `servicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assinaturas` ADD CONSTRAINT `assinaturas_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assinaturas` ADD CONSTRAINT `assinaturas_planos_id_fkey` FOREIGN KEY (`planos_id`) REFERENCES `planos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos` ADD CONSTRAINT `pagamentos_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos_produtos` ADD CONSTRAINT `pedidos_produtos_pedidos_id_fkey` FOREIGN KEY (`pedidos_id`) REFERENCES `pedidos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos_produtos` ADD CONSTRAINT `pedidos_produtos_produtos_id_fkey` FOREIGN KEY (`produtos_id`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_eventos` ADD CONSTRAINT `participantes_eventos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_eventos` ADD CONSTRAINT `participantes_eventos_eventos_id_fkey` FOREIGN KEY (`eventos_id`) REFERENCES `eventos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
