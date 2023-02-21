import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInterceptor } from './http-client.interceptor';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './timeout-interceptor.service';

export const interceptorsLink = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
  { provide: DEFAULT_TIMEOUT, useValue: 32000 }
];