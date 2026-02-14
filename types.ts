
export type CharacterName = 'Vansh' | 'Simran' | '';

export enum GameScene {
  MAIL = 'MAIL',
  SELECTION = 'SELECTION',
  CAKE = 'CAKE',
  BLESSINGS = 'BLESSINGS'
}

export interface Person {
  id: number;
  name: string;
  isBirthdayPerson: boolean;
  avatar: string;
  fed: boolean;
}

export interface BlessingSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  image: string;
}
