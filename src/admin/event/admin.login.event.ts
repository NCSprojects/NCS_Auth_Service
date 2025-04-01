export class AdminLoginEvent {
  constructor(
    public readonly id: string,
    public readonly ip: string,
    public readonly timestamp: Date,
  ) {}
}
