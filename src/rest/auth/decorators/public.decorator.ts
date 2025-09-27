import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to mark routes as public (no authentication required)
 * Usage: @Public() on controller methods
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
