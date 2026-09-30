import { AuthGoogleGuard } from './auth-google.guard';

describe('AuthGoogleGuard', () => {
  it('should be defined', () => {
    expect(new AuthGoogleGuard()).toBeDefined();
  });
});
