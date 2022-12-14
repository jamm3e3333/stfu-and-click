/**
 * @property {string} name Name of the error class
 * @extends Error
 */
export class HttpJsonError extends Error {
  /**
   * @param message Error message
   * @param status Status code for http response
   * @param code Custom error code
   */
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code: string = '',
    public readonly errorData?: object
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }

  public toJSON() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      errorData: this.errorData,
      errorClass: this.constructor.name,
      stack: this.stack,
    }
  }
}

export interface ErrorData {
  message?: string
  code?: string
}

export class BadRequest extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(400, data.message ?? 'Client error', data.code ?? '?', errorData)
  }
}

export class NotAuthorized extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(
      403,
      data.message ?? 'Insufficient aceess',
      data.code ?? '?',
      errorData
    )
  }
}

export class ValidationError extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(422, data.message ?? 'Invalid data', data.code ?? '?', errorData)
  }
}

export class NotAuthenticated extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(
      401,
      data.message ?? 'Requires authentication',
      data.code ?? '?',
      errorData
    )
  }
}

export class NotFound extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(
      404,
      data.message ?? 'Resource not found',
      data.code ?? '?',
      errorData
    )
  }
}

export class ServerError extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(500, data.message ?? 'Server error', data.code ?? '?', errorData)
  }
}

export class ServiceUnavailable extends HttpJsonError {
  constructor(data: ErrorData = {}, errorData?: any) {
    super(
      503,
      data.message ?? 'Service Unavailable',
      data.code ?? '?',
      errorData
    )
  }
}
