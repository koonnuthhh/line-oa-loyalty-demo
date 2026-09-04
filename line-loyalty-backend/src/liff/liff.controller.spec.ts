import { Test, TestingModule } from '@nestjs/testing';
import { LiffController } from './liff.controller';

describe('LiffController', () => {
  let controller: LiffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiffController],
    }).compile();

    controller = module.get<LiffController>(LiffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
