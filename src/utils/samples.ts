import album1 from '@/assets/samples/1.png'
import album2 from '@/assets/samples/2.png'
import album3 from '@/assets/samples/3.png'
import audio1 from '@/assets/samples/1.mp3'
import audio2 from '@/assets/samples/2.mp3'
import audio3 from '@/assets/samples/3.mp3'

export const textSamples = [
  {
    text: 'Под каким псевдонимом выступает Гордон Мэттью Томас Самнер?',
    choices: ['Moby', 'Fatboy Slim', 'Sting', 'Slash'],
    correctIndex: 2
  },
  {
    text: 'Кто выиграл в номинации Grammy “Запись года” 2010 года?',
    choices: ['Beyonce - Halo', 'Lady Gaga - Poker Face', 'Black Eyed Peas - I Gotta Feeling', 'Kings of Leon - Use Somebody'],
    correctIndex: 3
  },
  {
    text: 'Под каким псевдонимом выступает Алиша Бет Мур?',
    choices: ['Kesha', 'Pink', 'Katy Perry', 'Nicki Minaj'],
    correctIndex: 1
  },
  {
    text: 'Лидер итогового Еврохит топ 40 за 2005 год?',
    choices: ['Find A Way - J-Five', 'Numb Encore - Jay-Z and Linkin Park', 'La Tortura - Shakira feat. Alejandro Sanz', 'Galvanize - The Chemical Brothers'],
    correctIndex: 0
  },
  {
    text: 'Какая из этих песен имеет наибольшее количество лайков в Spotify?',
    choices: ['Panic! At the Disco - High Hopes', 'Fall Out Boy - Centuries', 'My Chemical Romance - Teenagers', 'Green Day - Basket Case'],
    correctIndex: 0
  },
]

export const imgSamples = [
  {
    text: 'Чья обложка альбома?',
    image: album1,
    choices: ['Kendrick Lamar', 'J. Cole', 'Nas', 'Drake'],
    correctIndex: 3
  },
  {
    text: 'Чья обложка альбома?',
    image: album2,
    choices: ['Blur', 'Oasis', 'Radiohead', 'Coldplay'],
    correctIndex: 2
  },
  {
    text: 'Чья обложка альбома?',
    image: album3,
    choices: ['The Black Crowes', 'The Black Keys', 'BLACKPINK', 'Black Veil Brides'],
    correctIndex: 1
  },
]

export const audioSamples = [
  {
    text: 'Отгадайте группу',
    audio: audio1,
    choices: ['Roxette', 'The Pretenders', 'Heart', 'The Runaways'],
    correctIndex: 2
  },
  {
    text: 'Отгадайте исполнителя',
    audio: audio2,
    choices: ['Troye Sivan', 'ZAYN', 'benny blanco', 'Lauv'],
    correctIndex: 0
  },
  {
    text: 'Отгадайте исполнителя',
    audio: audio3,
    choices: ['Дастан Оразбеков', 'Нуржан Керменбаев', 'Марсель', 'Кентал'],
    correctIndex: 3
  },
]
