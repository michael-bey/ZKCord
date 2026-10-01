import { SANCTIONED_COUNTRIES, type QueryBuilder } from '@zkpassport/sdk';

export const SCOPE = 'zkcord-verification';

export interface QueryOptions {
  /** Passports must not expire before this moment. */
  expiryAfter: Date;
  /** Only ask for the gender marker when the server has gender roles. */
  askGender: boolean;
}

/**
 * What ZKCord asks a passport for. The browser uses this to build the request, and the server
 * rebuilds the same query to check the proofs against, so a tampered request can't pass.
 */
export function zkcordQuery<T extends 'online' | 'offline'>(builder: QueryBuilder<T>, opts: QueryOptions) {
  let query = builder
    .gte('age', 18)
    .gte('expiry_date', opts.expiryAfter)
    .out('nationality', SANCTIONED_COUNTRIES)
    .disclose('nationality');
  if (opts.askGender) query = query.disclose('gender');
  return query;
}
