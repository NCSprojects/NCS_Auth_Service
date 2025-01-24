import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// 인증 코드 모델 타입
export type AuthCodeDocument = HydratedDocument<AuthCodeEntity>; // HydratedDocument로 변경

@Schema({ collection: 'auth_codes' })
export class AuthCodeEntity {
  @Prop({ required: true })
  randomId: number; // 사용자 고유 ID
  @Prop({ required: true, default: Date.now })
  createdAt: Date; // 인증 코드 발급 시간
}

// Mongoose 스키마 생성
export const AuthCodeSchema = SchemaFactory.createForClass(AuthCodeEntity);
