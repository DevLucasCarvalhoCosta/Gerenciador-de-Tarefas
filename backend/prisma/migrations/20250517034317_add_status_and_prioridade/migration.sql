/*
  Warnings:

  - You are about to alter the column `status` on the `tarefa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `tarefa` ADD COLUMN `prioridade` ENUM('baixa', 'media', 'alta') NOT NULL DEFAULT 'baixa',
    MODIFY `status` ENUM('pendente', 'em_andamento', 'concluida') NOT NULL DEFAULT 'pendente';
