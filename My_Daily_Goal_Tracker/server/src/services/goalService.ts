import prisma from '../lib/prisma.js';

export const goalService = {
  /*
  * fonction : crée les goals dans la bdd
  */
  async createGoal(text: string, priority: string) {
    return await prisma.goal.create({
      data: {
        text,
        priority,
        completed: false
      }
    });
  },

  /*
  * fonction : retourne tout les goals de la bdd
  */
  async getAllGoals() {
    return await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  /*
  * fonction : modifie l'état de la checkbox pour la validation du goal
  */
  async toggleGoal(id: number, completed: boolean) {
    return await prisma.goal.update({
      where: { id },
      data: { completed },
    });
  }
};