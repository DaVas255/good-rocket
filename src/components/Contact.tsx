import { useState } from 'react';
import { contacts } from '../config/site';
import { ArrowIcon } from './ArrowIcon';

type Props = { message: string; onMessageChange: (message: string) => void };
export const DEFAULT_PROJECT_MESSAGE =
  'Привет! Хочу обсудить проект.\nНужно сделать: …\nДля кого и зачем: …\nЖелаемые сроки и бюджет: …';

export function Contact({ message, onMessageChange }: Props) {
  const [feedback, setFeedback] = useState('');

  async function copyMessage() {
    const text = message.trim() || DEFAULT_PROJECT_MESSAGE;
    setFeedback('');
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Скопировано. Сообщение можно вставить в переписку.');
    } catch {
      setFeedback('Выделите текст в поле и скопируйте его вручную.');
    }
  }

  return (
    <section className='contact section'>
      <div className='wrap contact-inner'>
        <div className='contact-copy'>
          <h2>
            Расскажите
            <br />о задаче
          </h2>
          <p>Можно без технического задания. Достаточно описать идею.</p>
          <div className='contact-direct' aria-label='Контакты'>
            <a
              href={`https://t.me/${contacts.telegram}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <span>Telegram</span>
              <strong>@{contacts.telegram}</strong>
            </a>
            <a href={`mailto:${contacts.email}`}>
              <span>Email</span>
              <strong>{contacts.email}</strong>
            </a>
          </div>
        </div>
        <div className='contact-card'>
          <label htmlFor='project-message'>Что хотите сделать?</label>
          <textarea
            id='project-message'
            rows={4}
            value={message}
            style={{ resize: 'none' }}
            onChange={(event) => {
              onMessageChange(event.target.value);
              setFeedback('');
            }}
            placeholder='Например: нужен сайт для студии и запись клиентов через Telegram…'
          />
          <button
            className='button primary'
            type='button'
            onClick={copyMessage}
          >
            Скопировать сообщение <ArrowIcon />
          </button>
          <span className='copy-feedback' role='status'>
            {feedback}
          </span>
        </div>
      </div>
    </section>
  );
}
