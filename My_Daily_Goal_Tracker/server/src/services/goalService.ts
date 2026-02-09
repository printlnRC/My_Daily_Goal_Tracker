import prisma from '../lib/prisma.js';

export const goalService = {
  // Créer un nouveau Goal
  async createGoal(text: string, priority: string) {
    return await prisma.goal.create({
      data: {
        text,
        priority,
        completed: false
      }
    });
  },

  // Récupérer tous les Goals
  async getAllGoals() {
    return await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  // server/src/services/goalService.ts
  async toggleGoal(id: number, completed: boolean) {
    return await prisma.goal.update({
      where: { id },
      data: { completed },
    });
  }
};