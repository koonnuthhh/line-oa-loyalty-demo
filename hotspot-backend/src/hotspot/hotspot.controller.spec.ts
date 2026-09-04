import { Test, TestingModule } from '@nestjs/testing';
import { HotspotController } from './hotspot.controller';

describe('HotspotController', () => {
  let controller: HotspotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotspotController],
    }).compile();

    controller = module.get<HotspotController>(HotspotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
