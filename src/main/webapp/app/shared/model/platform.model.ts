import { IVideoGame } from 'app/shared/model/video-game.model';

export interface IPlatform {
  id?: number;
  name?: string;
  games?: IVideoGame[];
}

export const defaultValue: Readonly<IPlatform> = {};
