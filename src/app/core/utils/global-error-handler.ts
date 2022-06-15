import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    // TODO: log to backend service to trace later
    // if(error.status == 401)
    console.error('==============ERROR==============', { error });
    throw error;
  }
}
