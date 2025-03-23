import { Award, Level } from "./stores/BattlePassStore";

export const mockLevels: Level[] = Array.from({ length: 12 }, (_, index) => {
  const id = index + 1;
  const isPremium = id % 3 === 0; // Каждый третий уровень премиум
  const awards: Award[] = Array.from({ length: Math.ceil(Math.random() * 3) }, (_, awardIndex) => ({
    amount: (awardIndex + 1) * 100 * id, // Сумма увеличивается в зависимости от уровня и индекса
    awardId: awardIndex + 1 + id * 10, // Уникальный ID награды
    nftId: awardIndex + 100 + id * 10, // Уникальный ID NFT
  }));

  return {
    id,
    level: id,
    experience: id * 500, // Опыт увеличивается с уровнем
    isPremium,
    status: isPremium ? 'premium' : 'standard', // Статус зависит от премиальности
    awards,
  };
});