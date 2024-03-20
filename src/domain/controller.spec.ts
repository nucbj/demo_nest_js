import { Test, TestingModule } from '@nestjs/testing';
import { DomainController } from './controller';
import { DomainService } from './service';

describe('DomainController', () => {
  let domainController: DomainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DomainController],
      providers: [DomainService],
    }).compile();

    domainController = app.get<DomainController>(DomainController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(domainController.getHello()).toBe('Hello World!');
    });
  });
});
