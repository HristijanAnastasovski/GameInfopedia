import { Moment } from 'moment';
import { IPublisher } from 'app/shared/model/publisher.model';
import { ICPU } from 'app/shared/model/cpu.model';
import { IGPU } from 'app/shared/model/gpu.model';
import { IPlatform } from 'app/shared/model/platform.model';
import { IGenre } from 'app/shared/model/genre.model';

export interface IVideoGame {
  id?: number;
  title?: string;
  releasedate?: Moment;
  price?: number;
  imageContentType?: string;
  image?: any;
  description?: any;
  averageRating?: number;
  minimumStorageRequired?: number;
  minimumRAMRequired?: number;
  publisher?: IPublisher;
  minimumCPURequired?: ICPU;
  minimumGPURequired?: IGPU;
  platforms?: IPlatform[];
  genres?: IGenre[];
}

export const defaultValue: Readonly<IVideoGame> = {};
