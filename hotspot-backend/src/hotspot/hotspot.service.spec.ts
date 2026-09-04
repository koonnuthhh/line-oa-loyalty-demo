import { Test, TestingModule } from '@nestjs/testing';
import { HotspotService } from './hotspot.service';

describe('HotspotService', () => {
  let service: HotspotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotspotService],
    }).compile();

    service = module.get<HotspotService>(HotspotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
