import {SerializationOptions, serialize} from './serialize';
import {parse} from './parse';
import {navestidlo} from './types';

export function format(s: string, options?: SerializationOptions) {
  return serialize(parse(s) ?? navestidlo(), options);
}
