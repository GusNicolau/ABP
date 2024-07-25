import { Exercise } from 'src/app/interfaces/exercise.interface';

export interface NewFav {
  email: string | null;
  favoritos: Exercise[];
}