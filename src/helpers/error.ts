export class FormError {
  constructor(
    private readonly field: string,
    private readonly type: string,
    private readonly message: string
  ) {}
}
