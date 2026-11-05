/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `cpf` VARCHAR(14) NULL,
    ADD COLUMN `sexo` VARCHAR(20) NULL;

-- CreateTable
CREATE TABLE `enderecos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `estado` VARCHAR(2) NOT NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `bairro` VARCHAR(100) NOT NULL,
    `rua` VARCHAR(150) NOT NULL,
    `numero` VARCHAR(20) NOT NULL,
    `complemento` VARCHAR(100) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `enderecos_usuarios_id_idx`(`usuarios_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cpf_key` ON `usuarios`(`cpf`);

-- AddForeignKey
ALTER TABLE `enderecos` ADD CONSTRAINT `enderecos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
