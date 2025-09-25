import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to mark routes as requiring 2FA (Two-Factor Authentication)
 * Usage: @TwoFactorAuthNeeded() on controller methods
 * Indicates that the route requires 2FA verification to access it.
 */
export const IS_2FA_NEEDED_KEY = 'is2faNeeded';
export const TwoFactorAuthNeeded = () => SetMetadata(IS_2FA_NEEDED_KEY, true);
