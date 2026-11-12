-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: risefit
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('09fed5ef-35ec-4a7d-91c5-4ce93f07e175','545c75e59f4c8b24b90bc1d2e86647f7ed9f3cc6129fa8f362f0a3200c640e0e','2026-11-05 14:14:34.854','20261105141432_add_checkout_address_and_payment',NULL,NULL,'2026-11-05 14:14:32.602',1),('24e8477b-6a5d-4d5b-9261-04336bc2ffd6','5d448e3dd80db07d7cec84fdaaca4794c6dc971a6c615eb27ba974ef6e07a2a9','2026-11-05 14:14:19.616','20260903190226_cria_modelo_profissional',NULL,NULL,'2026-11-05 14:14:19.527',1),('2fd5352c-5065-46b8-a642-20517e85600c','be3760c1d8a25e49e3afad22be5819d073f5a11d062628c039bb671b75593dec','2026-11-05 14:14:19.470','20260903182941_init',NULL,NULL,'2026-11-05 14:14:19.435',1),('53da9680-2fe6-400d-966c-beba5f1d5d64','9665f0dd0bb24e61f15e42a12f923a2f40c599d374d17748576f218f5a7c8520','2026-11-05 14:14:19.526','20260903185143_cria_modelo_usuario',NULL,NULL,'2026-11-05 14:14:19.472',1),('657afe2e-8d54-4487-869a-187d4c3ff5d3','8186231cd5e6bc37322050f6a0da1aa6aab618baa9e137bf80a2230fdd8b97cb','2026-11-05 14:14:19.921','20260903190908_adiciona_servicos',NULL,NULL,'2026-11-05 14:14:19.618',1),('664e566a-0aad-4282-9aa9-1fad3388f016','1d59346cb078b26606c26c057eb63e7b8ffd6f58a1fe415fc89ad105651e045e','2026-11-05 14:14:21.055','20261016190216_adiciona_exercicios',NULL,NULL,'2026-11-05 14:14:20.990',1),('a22f3795-5126-414f-8a08-2c852d4d0f57','99937cb6c3cc24bcb9eb4edf104e7ddc120046393f44fabc7771af469affe510','2026-11-05 14:14:20.347','20260903194238_adiciona_assinaturas',NULL,NULL,'2026-11-05 14:14:19.923',1),('b2fa739d-9594-44a4-84aa-7f3758684d3c','ed19fe3b212052c203550320ce3b351963651402c1582902e415e7f9ea248bbe','2026-11-05 14:32:00.279','20261105143200_add_default_to_forma_pagamento',NULL,NULL,'2026-11-05 14:32:00.230',1),('c4d6b205-f448-44d7-a33f-84182ba7e42c','e2cb438bd742468b096dcb9a4bbf6ec1778510522744cf02a756bfd00bc4395f','2026-11-05 14:25:53.485','20261105142553_add_address_model',NULL,NULL,'2026-11-05 14:25:53.107',1),('e1eb65a4-8bd0-44c2-87ed-a5d288b4109d','f8144e15841d4c7672f394af85b6c379c74ec6c9b4cb3950aec35ffe5760f1e6','2026-11-05 14:14:20.721','20260903194652_adiciona_produtos',NULL,NULL,'2026-11-05 14:14:20.348',1),('ef7f2e75-8a2e-4371-a2b8-899a2cb9fa42','0fd130ff2af0afa326707dc1fb033e5ce7fdbc6428f274ca34e149ecb3c6d409','2026-11-05 14:14:20.989','20260903195222_adiciona_eventos',NULL,NULL,'2026-11-05 14:14:20.722',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assinaturas`
--

DROP TABLE IF EXISTS `assinaturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assinaturas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarios_id` int NOT NULL,
  `planos_id` int NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `status` enum('ATIVA','CANCELADA','EXPIRADA','PENDENTE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDENTE',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assinaturas_usuarios_id_idx` (`usuarios_id`),
  KEY `assinaturas_planos_id_idx` (`planos_id`),
  KEY `assinaturas_status_idx` (`status`),
  CONSTRAINT `assinaturas_planos_id_fkey` FOREIGN KEY (`planos_id`) REFERENCES `planos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `assinaturas_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assinaturas`
--

LOCK TABLES `assinaturas` WRITE;
/*!40000 ALTER TABLE `assinaturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `assinaturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enderecos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarios_id` int NOT NULL,
  `cep` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cidade` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rua` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `complemento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `enderecos_usuarios_id_idx` (`usuarios_id`),
  CONSTRAINT `enderecos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enderecos`
--

LOCK TABLES `enderecos` WRITE;
/*!40000 ALTER TABLE `enderecos` DISABLE KEYS */;
/*!40000 ALTER TABLE `enderecos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `local` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `horario_inicio` datetime(3) NOT NULL,
  `horario_fim` datetime(3) NOT NULL,
  `capacidade` int NOT NULL,
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercicios`
--

DROP TABLE IF EXISTS `exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercicios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `passo_a_passo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `erros_comuns` text COLLATE utf8mb4_unicode_ci,
  `nivel` enum('INICIANTE','INTERMEDIARIO','AVANCADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INICIANTE',
  `url_video` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exercicios_grupo_muscular_idx` (`grupo_muscular`),
  KEY `exercicios_nivel_idx` (`nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamentos`
--

DROP TABLE IF EXISTS `pagamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidoId` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bandeira` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ultimosDigitos` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `criadoEm` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `pagamentos_pedidoId_key` (`pedidoId`),
  CONSTRAINT `pagamentos_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamentos`
--

LOCK TABLES `pagamentos` WRITE;
/*!40000 ALTER TABLE `pagamentos` DISABLE KEYS */;
INSERT INTO `pagamentos` VALUES (1,1,'tok_mock_1793891009042','VISA','5432','2026-11-05 15:03:29.348'),(2,2,'tok_mock_1793892531011','VISA','5432','2026-11-05 15:28:51.196'),(3,3,'tok_mock_1793893065310','VISA','5432','2026-11-05 15:37:45.409');
/*!40000 ALTER TABLE `pagamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participantes_eventos`
--

DROP TABLE IF EXISTS `participantes_eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participantes_eventos` (
  `usuarios_id` int NOT NULL,
  `eventos_id` int NOT NULL,
  `registrado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` enum('INSCRITO','CANCELADO','PRESENTE','AUSENTE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INSCRITO',
  PRIMARY KEY (`usuarios_id`,`eventos_id`),
  KEY `participantes_eventos_eventos_id_idx` (`eventos_id`),
  KEY `participantes_eventos_status_idx` (`status`),
  CONSTRAINT `participantes_eventos_eventos_id_fkey` FOREIGN KEY (`eventos_id`) REFERENCES `eventos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `participantes_eventos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participantes_eventos`
--

LOCK TABLES `participantes_eventos` WRITE;
/*!40000 ALTER TABLE `participantes_eventos` DISABLE KEYS */;
/*!40000 ALTER TABLE `participantes_eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarios_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('PENDENTE','CONFIRMADO','ENVIADO','ENTREGUE','CANCELADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDENTE',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  `formaPagamento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'credito',
  PRIMARY KEY (`id`),
  KEY `pedidos_usuarios_id_idx` (`usuarios_id`),
  KEY `pedidos_status_idx` (`status`),
  CONSTRAINT `pedidos_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos_produtos`
--

DROP TABLE IF EXISTS `pedidos_produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidos_id` int NOT NULL,
  `produtos_id` int NOT NULL,
  `quantidade` int NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pedidos_produtos_pedidos_id_produtos_id_key` (`pedidos_id`,`produtos_id`),
  KEY `pedidos_produtos_produtos_id_idx` (`produtos_id`),
  CONSTRAINT `pedidos_produtos_pedidos_id_fkey` FOREIGN KEY (`pedidos_id`) REFERENCES `pedidos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pedidos_produtos_produtos_id_fkey` FOREIGN KEY (`produtos_id`) REFERENCES `produtos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_produtos`
--

LOCK TABLES `pedidos_produtos` WRITE;
/*!40000 ALTER TABLE `pedidos_produtos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos_produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planos`
--

DROP TABLE IF EXISTS `planos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `preco` decimal(8,2) NOT NULL,
  `duracao_meses` int NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planos`
--

LOCK TABLES `planos` WRITE;
/*!40000 ALTER TABLE `planos` DISABLE KEYS */;
/*!40000 ALTER TABLE `planos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planos_servicos`
--

DROP TABLE IF EXISTS `planos_servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planos_servicos` (
  `planos_id` int NOT NULL,
  `servicos_id` int NOT NULL,
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`planos_id`,`servicos_id`),
  KEY `planos_servicos_servicos_id_fkey` (`servicos_id`),
  CONSTRAINT `planos_servicos_planos_id_fkey` FOREIGN KEY (`planos_id`) REFERENCES `planos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `planos_servicos_servicos_id_fkey` FOREIGN KEY (`servicos_id`) REFERENCES `servicos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planos_servicos`
--

LOCK TABLES `planos_servicos` WRITE;
/*!40000 ALTER TABLE `planos_servicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `planos_servicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `preco` decimal(9,2) NOT NULL,
  `estoque` int NOT NULL DEFAULT '0',
  `url_imagem` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `produtos_ativo_idx` (`ativo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profissionais`
--

DROP TABLE IF EXISTS `profissionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profissionais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarios_id` int NOT NULL,
  `especializacao` varchar(145) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci,
  `urlFoto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profissionais_usuarios_id_key` (`usuarios_id`),
  CONSTRAINT `profissionais_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profissionais`
--

LOCK TABLES `profissionais` WRITE;
/*!40000 ALTER TABLE `profissionais` DISABLE KEYS */;
/*!40000 ALTER TABLE `profissionais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profissionais_servicos`
--

DROP TABLE IF EXISTS `profissionais_servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profissionais_servicos` (
  `profissionais_id` int NOT NULL,
  `servicos_id` int NOT NULL,
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`profissionais_id`,`servicos_id`),
  KEY `profissionais_servicos_servicos_id_fkey` (`servicos_id`),
  CONSTRAINT `profissionais_servicos_profissionais_id_fkey` FOREIGN KEY (`profissionais_id`) REFERENCES `profissionais` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `profissionais_servicos_servicos_id_fkey` FOREIGN KEY (`servicos_id`) REFERENCES `servicos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profissionais_servicos`
--

LOCK TABLES `profissionais_servicos` WRITE;
/*!40000 ALTER TABLE `profissionais_servicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `profissionais_servicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicos`
--

DROP TABLE IF EXISTS `servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicos`
--

LOCK TABLES `servicos` WRITE;
/*!40000 ALTER TABLE `servicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` enum('ALUNO','PROFISSIONAL','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ALUNO',
  `criado_em` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` datetime(3) NOT NULL,
  `data_nascimento` date NOT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_key` (`email`),
  UNIQUE KEY `usuarios_cpf_key` (`cpf`),
  KEY `usuarios_cargo_idx` (`cargo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11 11:41:12
