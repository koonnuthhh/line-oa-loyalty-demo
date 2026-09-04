import { Test, TestingModule } from '@nestjs/testing';
import { LineoaNimbusService } from '../lineoa_nimbus.service';

describe('LineoaNimbusService', () => {
  let service: LineoaNimbusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineoaNimbusService],
    }).compile();

    service = module.get<LineoaNimbusService>(LineoaNimbusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
