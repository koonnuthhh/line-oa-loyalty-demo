import { Test, TestingModule } from '@nestjs/testing';
import { LineoaNimbusController } from './nimbus.controller';

describe('LineoaNimbusController', () => {
  let controller: LineoaNimbusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineoaNimbusController],
    }).compile();

    controller = module.get<LineoaNimbusController>(LineoaNimbusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
