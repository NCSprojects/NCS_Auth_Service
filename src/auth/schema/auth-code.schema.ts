import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// 인증 코드 모델 타입
export type AuthCodeDocument = HydratedDocument<AuthCodeEntity>; // HydratedDocument로 변경

@Schema({ collection: 'auth_codes' })
export class AuthCodeEntity {
  @Prop({ required: true })
  randomId: string; // 사용자 고유 ID
  @Prop({ required: true, default: Date.now })
  createdAt: Date; // 인증 코드 발급 시간
  @Prop({ required: true })
  preRev: boolean;
  @Prop({ required: true, default: 0 })
  adCnt: number;
  @Prop({ required: true, default: 0 })
  cdCnt: number;
  @Prop({ required: false })
  scheduleId: number;
}

// Mongoose 스키마 생성
export const AuthCodeSchema = SchemaFactory.createForClass(AuthCodeEntity);
