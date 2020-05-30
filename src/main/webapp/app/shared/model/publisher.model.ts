import { IVideoGame } from 'app/shared/model/video-game.model';

export interface IPublisher {
  id?: number;
  name?: string;
  country?: string;
  description?: any;
  games?: IVideoGame[];
}

export const defaultValue: Readonly<IPublisher> = {};
