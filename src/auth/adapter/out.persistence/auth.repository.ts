import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuthCodeEntity,
  AuthCodeDocument,
} from '../../schema/auth-code.schema';
import { Model } from 'mongoose';
// 인증 코드 모델

@Injectable()
export class AuthCodeRepository {
  constructor(
    @InjectModel(AuthCodeEntity.name)
    private readonly authCodeModel: Model<AuthCodeDocument>, // Mongoose 모델 주입
  ) {}

  // 인증 코드 생성
  async createAuthCode(
    randomId: string,
    createdAt: Date,
    visitors: number,
    guardians: number,
    isReserved: boolean,
    isManual: boolean,
    scheduleId: number,
  ): Promise<AuthCodeDocument> {
    const createdAuthCode = new this.authCodeModel({
      randomId,
      createdAt: createdAt, // 생성 시간을 기본값으로 설정
      preRev: isReserved,
      manuYn: isManual,
      adCnt: guardians,
      cdCnt: visitors,
      scheduleId: scheduleId,
    });

    return createdAuthCode.save(); // 저장된 인증 코드 반환
  }

  // 인증 코드 찾기 (randomId로만 찾기)
  async findAuthCodeByRandomId(randomId: string): Promise<AuthCodeDocument[]> {
    return this.authCodeModel.find({ randomId }).exec();
  }

  // 인증 코드 찾기 (randomId와 createdAt으로 찾기)
  async findAuthCode(
    randomId: string,
    createdAt: Date,
  ): Promise<AuthCodeDocument | null> {
    return this.authCodeModel.findOne({ randomId, createdAt }).exec();
  }

  // 인증 코드 삭제
  async deleteAuthCode(randomId: string, createdAt: Date): Promise<boolean> {
    const result = await this.authCodeModel
      .deleteOne({ randomId, createdAt })
      .exec();
    return result.deletedCount > 0; // 삭제된 개수 확인
  }
}
