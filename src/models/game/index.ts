export interface Game {
  id: number
  createdAt: string
  updatedAt: string
  status: string
  score: number
  gameQuestions: GameQuestion[]
}

interface GameQuestion {
  id: number
  gameId: number
  questionId: number
  answer: string
  musicQuestion?: MusicQuestion
  movieQuestion?: MovieQuestion
}

interface MusicQuestion {
  text: string
  file_path: string
}

interface MovieQuestion {
  enName: string
  alternativeName: string
  year: number
  director: string
  genres: string
  type: string
  questionText: string
}

export interface CreateGamePayload {
  tg_username: string
  tg_id: number
}
export interface FinishGamePayload {
  score: number
  gameId: number
}
