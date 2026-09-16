import { LanguageMode } from '../types';

export interface LanguageInfo {
  id: LanguageMode;
  name: string;
  badge: string;
  ext: string;
  color: string;
  practiceFileName: string;
  difficultFileName: string;
  learningFileName: string;
  masteredFileName: string;
  allFileName: string;
  customFileName: string;
  className: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    badge: 'TS',
    ext: '.ts',
    color: '#3178c6',
    practiceFileName: 'practice_session.ts',
    difficultFileName: 'difficult_cache.ts',
    learningFileName: 'learning_queue.ts',
    masteredFileName: 'mastered_records.ts',
    allFileName: 'word_database.ts',
    customFileName: 'custom_words.ts',
    className: 'VocabularyEvaluator',
    description: 'TypeScript React / Node.js (ECMAScript 2022)',
  },
  {
    id: 'java',
    name: 'Java',
    badge: 'JAVA',
    ext: '.java',
    color: '#e76f00',
    practiceFileName: 'PracticeSession.java',
    difficultFileName: 'DifficultCache.java',
    learningFileName: 'LearningQueue.java',
    masteredFileName: 'MasteredRecords.java',
    allFileName: 'WordDatabase.java',
    customFileName: 'CustomWords.java',
    className: 'PracticeSession',
    description: 'Java 21 Standard Edition (JVM Enterprise)',
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'PY',
    ext: '.py',
    color: '#3572A5',
    practiceFileName: 'practice_session.py',
    difficultFileName: 'difficult_cache.py',
    learningFileName: 'learning_queue.py',
    masteredFileName: 'mastered_records.py',
    allFileName: 'word_database.py',
    customFileName: 'custom_words.py',
    className: 'WordEvaluationContext',
    description: 'Python 3.12 (CPython / AsyncIO)',
  },
  {
    id: 'cpp',
    name: 'C++',
    badge: 'C++',
    ext: '.cpp',
    color: '#f34b7d',
    practiceFileName: 'practice_session.cpp',
    difficultFileName: 'difficult_cache.cpp',
    learningFileName: 'learning_queue.cpp',
    masteredFileName: 'mastered_records.cpp',
    allFileName: 'word_database.cpp',
    customFileName: 'custom_words.cpp',
    className: 'PracticeSession',
    description: 'ISO C++20 Standard (STL / Concurrency)',
  },
  {
    id: 'go',
    name: 'Go',
    badge: 'GO',
    ext: '.go',
    color: '#00ADD8',
    practiceFileName: 'practice_session.go',
    difficultFileName: 'difficult_cache.go',
    learningFileName: 'learning_queue.go',
    masteredFileName: 'mastered_records.go',
    allFileName: 'word_database.go',
    customFileName: 'custom_words.go',
    className: 'PracticeSession',
    description: 'Go 1.22 Package (Goroutines)',
  },
  {
    id: 'rust',
    name: 'Rust',
    badge: 'RS',
    ext: '.rs',
    color: '#dea584',
    practiceFileName: 'practice_session.rs',
    difficultFileName: 'difficult_cache.rs',
    learningFileName: 'learning_queue.rs',
    masteredFileName: 'mastered_records.rs',
    allFileName: 'word_database.rs',
    customFileName: 'custom_words.rs',
    className: 'Evaluator',
    description: 'Rust 2021 Edition (Cargo / Memory Safe)',
  },
];

export const getLanguageInfo = (mode: LanguageMode): LanguageInfo => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.id === mode) || SUPPORTED_LANGUAGES[0];
};
