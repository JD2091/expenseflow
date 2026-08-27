/* Registers the extensionless-import resolver. Use with:
 *     node --import ./apps/expenseflow/scripts/ts-register.mjs --test <file>
 */
import { register } from 'node:module';

register('./ts-resolve.mjs', import.meta.url);
