CREATE TABLE `avaliacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`unidadeId` varchar(64) NOT NULL,
	`atendimentoRecepcao` enum('Ótimo','Bom','Regular','Ruim','Péssimo','Não sabe/Não opinou') NOT NULL,
	`tempoEsperaRecepcao` enum('Ótimo','Bom','Regular','Ruim','Péssimo','Não sabe/Não opinou') NOT NULL,
	`tempoEsperaConsulta` enum('Ótimo','Bom','Regular','Ruim','Péssimo','Não sabe/Não opinou') NOT NULL,
	`infraestrutura` enum('Ótimo','Bom','Regular','Ruim','Péssimo','Não sabe/Não opinou') NOT NULL,
	`retornoElogio` enum('Eu fiz e tive retorno rápido','Eu fiz e tive retorno demorado','Eu fiz e nunca tive retorno','Eu nunca fiz') NOT NULL,
	`comentario` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `avaliacoes_id` PRIMARY KEY(`id`)
);
