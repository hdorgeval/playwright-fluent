import { Request } from 'playwright';
export const mockRequest: Request = {
  url: jest.fn(),
  method: jest.fn(),
  failure: jest.fn(),
  frame: jest.fn(),
  headers: jest.fn(),
  postData: jest.fn(),
  isNavigationRequest: jest.fn(),
  postDataBuffer: jest.fn(),
  redirectedFrom: jest.fn(),
  postDataJSON: jest.fn(),
  redirectedTo: jest.fn(),
  resourceType: jest.fn(),
  timing: jest.fn(),
  response: jest.fn(),
};
