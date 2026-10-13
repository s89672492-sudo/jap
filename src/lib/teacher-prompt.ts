import type { JlptLevel } from '@/data/vocab';

import type { ChatMessage } from './local-llm-models';

/** 小模型的上下文有限，只帶最近幾則對話 */
const HISTORY_LIMIT = 8;

export function systemPrompt(level: JlptLevel): string {
  return [
    '你是「偵探日語」App 裡親切的日文老師。學生的母語是繁體中文，目前程度是 JLPT ' + level + '。',
    '規則：',
    '1. 一律用繁體中文解說，不要用簡體字。',
    '2. 日文例句後面用括號附上平假名讀音和中文翻譯。',
    '3. 用詞和例句配合學生的程度，回答簡短、條列重點。',
    '4. 學生寫的日文有錯時，先給正確寫法，再說明錯在哪裡。',
    '5. 不確定的內容要老實說不確定，不要編造。',
  ].join('\n');
}

export function buildMessages(level: JlptLevel, history: ChatMessage[]): ChatMessage[] {
  return [{ role: 'system', content: systemPrompt(level) }, ...history.slice(-HISTORY_LIMIT)];
}

/** 模型偶爾會輸出 Markdown 符號或空的思考標記，畫面上直接拿掉 */
export function cleanReply(text: string): string {
  return text
    .replace(/<think>[\s\S]*?(<\/think>|$)/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

export const SUGGESTED_QUESTIONS = [
  '「は」和「が」有什麼不同？',
  '用三個簡單的句子示範「〜ています」',
  '幫我改這句日文：私は昨日学校に行きます。',
  '「すみません」和「ごめんなさい」怎麼分？',
];
