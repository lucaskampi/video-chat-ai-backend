# QR Food Service - Development Skills

This document defines the development practices, conventions, and patterns used in this project. All code must follow these guidelines.

---

## 1. Clean Code Principles

### General Rules
- Write code for humans first, computers second
- Functions should do one thing and do it well
- Keep functions under 30 lines
- Keep classes under 200 lines
- Use meaningful, descriptive names (no abbreviations except standard ones like `id`, `url`)
- Comments explain **why**, not **what**
- Delete dead code immediately

### Code Formatting
- 2 spaces indentation
- Single quotes for strings
- Semicolons at end of statements
- Trailing commas in multiline
- Max line length: 100 characters

### TypeScript Guidelines
- Use `interface` for shapes, `type` for unions/intersections
- Avoid `any` - use `unknown` and narrow appropriately
- Use strict null checks
- Prefer `const` over `let`, never use `var`
- Use async/await over raw promises
- Import ordering: external → internal → relative

---

## 2. Clean Architecture

Each service follows a layered architecture:

```
src/
├── main.ts                     # Bootstrap application
├── app.module.ts              # Root module
├── controllers/               # HTTP entry points (thin)
│   └── *.controller.ts
├── services/                  # Business logic
│   └── *.service.ts
├── dto/                       # Data Transfer Objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── response-*.dto.ts
├── entities/                  # Domain entities
│   └── *.entity.ts
├── exceptions/                # Custom exceptions
│   └── *.exception.ts
├── events/                    # Domain events
│   └── *.event.ts
├── interfaces/                # Contracts
│   └── *.interface.ts
└── repository/               # Data access layer (if needed)
    └── *.repository.ts
```

### Layer Responsibilities

| Layer | Responsibility | Rules |
|-------|---------------|-------|
| Controller | Receive request, validate input, return response | Max 10 lines per method |
| Service | Business logic, orchestration, validation | No HTTP knowledge |
| DTO | Data shape for API | Use class-validator |
| Entity | Domain model, business rules | No serialization logic |
| Repository | Database operations | Prisma wrapper |

### Dependency Rule
```
Controller → Service → Repository/DTO
```
Controllers never call repositories directly. Services contain all business logic.

---

## 3. SOLID Principles

### Single Responsibility (SRP)
- Each class has one reason to change
- Each method does one thing

### Open/Closed Principle (OCP)
- Open for extension (add new features)
- Closed for modification (don't change existing code)

### Liskov Substitution (LSP)
- Subclasses implement all parent expectations
- Use interfaces for polymorphism

### Interface Segregation (ISP)
- Small, focused interfaces
- Prefer many specific interfaces over one general

### Dependency Inversion (DIP)
- Depend on abstractions, not concretions
- NestJS DI handles this with `injectable()`

### Applied Example
```typescript
// BAD - violates SRP and DIP
class OrderService {
  constructor(private prisma: PrismaService) {} // concrete dependency
  async createOrder(data: any) {
    // business logic + validation + DB call
  }
}

// GOOD - separation of concerns
class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly menuService: MenuServiceInterface, // abstraction
  ) {}
}
```

---

## 4. Design Patterns

### Patterns Used in This Project

| Pattern | Where | Purpose |
|---------|-------|---------|
| **Repository** | Data access | Abstraction over Prisma |
| **Factory** | Seed scripts | Create test data |
| **Observer** | Events | OrderCreated, OrderReady notifications |
| **Builder** | DTOs | Fluent object construction |
| **Strategy** | Payment (future) | Swappable payment providers |
| **Facade** | Kitchen display | Simplified order queue interface |
| **DTO** | API layer | Input validation + response shaping |
| **Mapper** | Entity↔DTO | Transform between layers |

### Observer Pattern (Events)
```typescript
// Event definition
export class OrderCreatedEvent {
  constructor(public readonly order: Order) {}
}

// Event emitter (in OrderService)
@Injectable()
export class OrderService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  
  async createOrder(dto: CreateOrderDto) {
    const order = await this.orderRepository.create(dto);
    this.eventEmitter.emit('order.created', new OrderCreatedEvent(order));
    return order;
  }
}

// Event listener (in KitchenService)
@Injectable()
export class OrderListener {
  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent) {
    // process order
  }
}
```

### Builder Pattern (DTOs)
```typescript
// Manual builder for complex DTOs
export class CreateOrderDtoBuilder {
  private items: OrderItemDto[] = [];
  private tableId: string = '';
  
  withTableId(id: string): this {
    this.tableId = id;
    return this;
  }
  
  addItem(item: OrderItemDto): this {
    this.items.push(item);
    return this;
  }
  
  build(): CreateOrderDto {
    if (!this.tableId) throw new Error('tableId required');
    return { tableId: this.tableId, items: this.items };
  }
}
```

---

## 5. Test-Driven Development (TDD)

### Required Test Types

| Type | Purpose | Location |
|------|---------|----------|
| **Unit** | Test single function/class in isolation | `*.spec.ts` alongside source |
| **E2E** | Test complete user flows | `test/*.e2e-spec.ts` |

### Test Pyramid

```
        /\
       /  \
      / E2E\     ← Few, slow, comprehensive
     /------\
    /  Unit  \   ← Many, fast, isolated
   /----------\
```

### Unit Test Rules
- One assertion block per test (mentally, not technically)
- Use `describe` blocks for grouping related tests
- Name tests: `should_doX_whenY`
- Mock external dependencies (other services, DB calls)
- Use factories, not hand-crafted objects

### Unit Test Example
```typescript
describe('OrderService', () => {
  let service: OrderService;
  let mockRepository: jest.Mocked<OrderRepository>;
  let mockEventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    mockRepository = createMock<OrderRepository>();
    mockEventEmitter = createMock<EventEmitter2>();
    service = new OrderService(mockRepository, mockEventEmitter);
  });

  describe('createOrder', () => {
    it('should create order and emit event', async () => {
      const dto = createOrderDtoFixture({ tableId: '123' });
      const expectedOrder = orderFixture({ id: '1', ...dto });
      
      mockRepository.create.mockResolvedValue(expectedOrder);

      const result = await service.createOrder(dto);

      expect(result).toEqual(expectedOrder);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'order.created',
        expect.any(OrderCreatedEvent),
      );
    });

    it('should throw BadRequestException when tableId is missing', async () => {
      const dto = createOrderDtoFixture({ tableId: '' });
      
      await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
```

### E2E Test Rules
- Test complete HTTP flows
- Use `app.init()` and `app.close()` lifecycle
- Test happy path + main error cases
- Do NOT mock the database (use test container or in-memory)

### E2E Test Example
```typescript
describe('/api/orders (e2e)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    app = await initApp();
  });
  
  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/orders', () => {
    it('should create order and return 201', async () => {
      const dto = {
        tableId: 'table-1',
        restaurantId: 'rest-1',
        items: [{ menuItemId: 'item-1', quantity: 2 }],
      };

      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('PENDING');
    });
  });
});
```

### Test Fixtures
```typescript
// Use factories for consistent test data
export const orderFixture = (overrides: Partial<Order> = {}): Order => ({
  id: 'order-1',
  status: 'PENDING',
  totalAmount: 100,
  tableId: 'table-1',
  restaurantId: 'rest-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createOrderDtoFixture = (overrides: Partial<CreateOrderDto> = {}): CreateOrderDto => ({
  tableId: 'table-1',
  restaurantId: 'rest-1',
  items: [{ menuItemId: 'item-1', quantity: 1 }],
  ...overrides,
});
```

---

## 6. Project Conventions

### Naming

| Entity | Naming | Example |
|--------|--------|---------|
| Service | `*.service.ts` | `OrderService` |
| Controller | `*.controller.ts` | `OrderController` |
| DTO | `create-*.dto.ts`, `response-*.dto.ts` | `CreateOrderDto` |
| Entity | `*.entity.ts` | `Order` |
| Event | `*.event.ts` | `OrderCreatedEvent` |
| Exception | `*.exception.ts` | `OrderNotFoundException` |
| Test | `*.spec.ts` (unit), `*.e2e-spec.ts` | `order.service.spec.ts` |

### File Structure per Service
```
apps/{service}/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   ├── entities/
│   ├── exceptions/
│   ├── events/
│   └── main.ts
├── test/
│   └── *.e2e-spec.ts
└── tsconfig.app.json
```

### API Response Format
```typescript
// Success
{ "data": { ... }, "meta": { ... } }

// Error
{ "statusCode": 400, "message": "Validation failed", "error": "Bad Request" }
```

### Error Handling
- Use NestJS built-in exceptions (`BadRequestException`, `NotFoundException`, etc.)
- Create service-specific exceptions when needed
- Catch at controller level - let NestJS handle HTTP response

### Swagger Documentation
- All endpoints must have API decorators
- Use `ApiOperation`, `ApiResponse`, `ApiBody` decorators
- Group endpoints with `ApiTags`
- Response schemas must be documented

```typescript
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(dto);
  }
}
```

---

## 7. Git Workflow

### Branch Naming
- `setup/*` - Initial project setup
- `lib/*` - Shared library development
- `{service}/*` - Feature development per service
- `integration/*` - Cross-service integration
- `events/*` - Event-driven architecture
- `observability/*` - Logging, metrics, health checks
- `frontend/*` - Frontend development
- `fix/*` - Bug fixes

### Commit Conventions

#### Atomic Commits
Each commit must represent **one logical change**. A commit should:
- Be self-contained (can be reverted independently)
- Contain related files only
- Have a clear, single purpose

#### Commit Pattern
```
tag: description
```

| Tag | Use Case |
|-----|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change without behavior change |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Build, configs, dependencies |
| `perf` | Performance improvement |

#### Rules
1. **One logical change per commit**
2. **Fewest files possible** - only files related to the commit's purpose
3. **Same context** - files in a commit should belong to the same logical area
4. **Descriptive message** - description answers: "what does this commit do?"

#### Good Commit Examples
```
feat(menu): add category create endpoint
```

```
fix(order): handle empty items array in create order
```

```
test(kitchen): add unit tests for order status service
```

```
refactor(common): extract validation decorator
```

```
chore: add prisma to dependencies
```

#### Bad Commit Examples
```
feat: add categories, orders, and menu items
```
❌ Multiple unrelated changes

```
WIP
```
❌ Unclear purpose

```
Updated stuff
```
❌ No tag, no description

```
fix(menu): fix validation
       - also refactored service
       - and fixed tests
```
❌ Contains multiple changes

#### File Selection Strategy
When staging files:
1. Group files by their logical context
2. If files belong to different "areas" (e.g., menu-service vs order-service), they should be separate commits
3. Use `git add -p` to stage specific hunks within a file
4. Prefer multiple small commits over one large commit

#### PR Title Pattern

```
feat: monorepo structure and NestJS service scaffolding
```

## PR Description Pattern

```markdown
## Overview

Brief description of what this PR does and why.

## Changes

### Summary
- List of main changes
- Grouped by logical area
- Use bullet points

### Technical Details
- Key implementation decisions
- Architecture choices
- Dependencies added

## Checklist

- [ ] Tests pass
- [ ] Follows clean code principles
- [ ] No console.log (uses Logger)
- [ ] Swagger docs added
```

---

## Merge Strategy
1. Create feature branch from `main`
2. Implement feature with passing tests
3. Commit atomically as you go
4. Open PR, ensure CI passes
5. Squash and merge to `main`
6. Delete branch, start next feature

---

## 8. Code Review Checklist

Before opening a PR, verify:

- [ ] Code follows Clean Code principles
- [ ] Tests written before or with implementation (TDD)
- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] No `console.log` (use Logger)
- [ ] No commented-out code
- [ ] Swagger docs on all endpoints
- [ ] Proper error handling
- [ ] Dependencies injected via constructor
- [ ] Business logic in services, not controllers
