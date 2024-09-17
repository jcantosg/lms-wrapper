import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import * as os from 'os';

@Controller('health')
export class HealthController {
  private readonly MEMORY_HEAP_THRESHOLD = 0.9;
  private readonly RSS_MEMORY_THRESHOLD = 0.9;
  private readonly DISK_THRESHOLD_PERCENT = 0.9;

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async checkAll() {
    return {
      dbCheck: await this.checkDatabaseHealth(),
      diskCheck: await this.checkDiskHealth(),
      memoryCheck: await this.checkMemoryHealth(),
    };
  }

  @Get('/db')
  @HealthCheck()
  async checkDatabase() {
    return await this.checkDatabaseHealth();
  }

  @Get('/disk')
  @HealthCheck()
  async checkDisk() {
    return await this.checkDiskHealth();
  }

  @Get('/memory')
  @HealthCheck()
  async checkMemory() {
    return await this.checkMemoryHealth();
  }

  async checkDiskHealth(): Promise<HealthCheckResult> {
    let diskCheck;
    try {
      diskCheck = await this.health.check([
        () =>
          this.disk.checkStorage('storage', {
            path: '/',
            thresholdPercent: this.DISK_THRESHOLD_PERCENT,
          }),
      ]);
    } catch (error) {
      diskCheck = error.response;
    }

    return diskCheck;
  }

  async checkMemoryHealth(): Promise<HealthCheckResult> {
    const totalMemory = os.totalmem(); // Get total system memory in bytes
    let memoryCheck;
    try {
      memoryCheck = await this.health.check([
        () => this.memory.checkHeap('memory_heap', totalMemory * this.MEMORY_HEAP_THRESHOLD),
        () => this.memory.checkRSS('RSS', totalMemory * this.RSS_MEMORY_THRESHOLD),
      ]);
    } catch (error) {
      memoryCheck = error.response;
    }

    return memoryCheck;
  }

  async checkDatabaseHealth(): Promise<HealthCheckResult> {
    let dbCheck;
    try {
      dbCheck = await this.health.check([() => this.db.pingCheck('database')]);
    } catch (error) {
      dbCheck = error.response;
    }

    return dbCheck;
  }
}