import schedule from 'node-schedule';
import { prisma } from '../lib/prisma';

function solicitationJob() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);

    prisma.solicitationUser.updateMany({
        where: {
            finalized: false,
            active_date: {
                lt: currentDate.toISOString(),
            },
        },
        data: {
            finalized: true,
        },
    }).then((updatedRecords) => {
        console.log(`Atualizados ${updatedRecords.count} registros de SolicitationUser.`);
    }).catch((error) => {
        console.error('Erro ao atualizar registros:', error);
    });
}

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;

const job = schedule.scheduleJob(rule, solicitationJob);
