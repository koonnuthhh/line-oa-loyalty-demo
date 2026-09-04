import { Test, TestingModule } from '@nestjs/testing';
import { LiffService } from './liff.service';

describe('LiffService', () => {
  let service: LiffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiffService],
    }).compile();

    service = module.get<LiffService>(LiffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
