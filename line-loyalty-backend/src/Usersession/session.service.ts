import { Injectable } from '@nestjs/common';

interface Answer {
  question: string;
  answer: string;
}

interface UserSession {
  questionIndex: number;
  answers: Answer[]; // ✅ Fixed: this matches how you're storing Q&A pairs
}

@Injectable()
export class SessionService {
  private sessions: Record<string, UserSession> = {};

  create(userId: string, session: UserSession): void {
    this.sessions[userId] = session;
  }

  get(userId: string): UserSession | null {
    return this.sessions[userId] || null;
  }

  update(userId: string, session: UserSession): void {
    this.sessions[userId] = session;
  }

  clear(userId: string): void {
    delete this.sessions[userId];
  }
}
