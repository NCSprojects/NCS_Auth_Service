import { Injectable } from '@nestjs/common';
import { AuthCodeEntity } from '../schema/auth-code.schema';
import { AuthCode } from '../domain/auth';
import { CreateRandomNumDto } from '../dto/create-random-num-dto';
// 도메인 객체

@Injectable()
export class AuthMapper {
  // Mongoose 문서를 도메인 객체로 변환
  toDomainFromEntity(authCodeEntity: AuthCodeEntity): AuthCode {
    const authCode = new AuthCode();
    authCode.randomId = authCodeEntity.randomId;
    authCode.createdAt = authCodeEntity.createdAt;

    return authCode;
  }

  // 도메인 객체를 Mongoose 문서로 변환
  toEntityFromDomain(authCode: AuthCode): AuthCodeEntity {
    const authCodeEntity = new AuthCodeEntity();
    authCodeEntity.randomId = authCode.randomId;
    authCodeEntity.createdAt = authCode.createdAt;

    return authCodeEntity;
  }

  toDtoFromEntity(authCodeEntity: AuthCodeEntity): CreateRandomNumDto {
    const createRandomNumDto = new CreateRandomNumDto();
    createRandomNumDto.code = authCodeEntity.randomId;
    createRandomNumDto.createdAt = authCodeEntity.createdAt;

    return createRandomNumDto;
  }

  toDtoFromDomain(authCode: AuthCode): CreateRandomNumDto {
    const createRandomNumDto = new CreateRandomNumDto();
    createRandomNumDto.code = authCode.randomId;
    createRandomNumDto.createdAt = authCode.createdAt;

    return createRandomNumDto;
  }
}
