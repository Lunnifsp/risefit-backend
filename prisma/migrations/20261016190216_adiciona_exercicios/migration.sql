-- CreateTable
CREATE TABLE `exercicios` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `grupo_muscular` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `passo_a_passo` TEXT NOT NULL,
    `erros_comuns` TEXT NULL,
    `nivel` ENUM('INICIANTE', 'INTERMEDIARIO', 'AVANCADO') NOT NULL DEFAULT 'INICIANTE',
    `url_video` VARCHAR(255) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    INDEX `exercicios_grupo_muscular_idx`(`grupo_muscular`),
    INDEX `exercicios_nivel_idx`(`nivel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
