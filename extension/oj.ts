import type { Platform } from 'un-oj';
import type { OJ } from '../shared/events';
import AtCoder from 'un-oj/platforms/atcoder';
import Codeforces from 'un-oj/platforms/codeforces';
import Hydro from 'un-oj/platforms/hydro';
import LeetCode from 'un-oj/platforms/leetcode';
import Luogu from 'un-oj/platforms/luogu';
import Lyrio from 'un-oj/platforms/lyrio';
import MXOJ from 'un-oj/platforms/mxoj';

export const OJ_INSTANCE: Record<OJ, Platform<any>> = {
  AtCoder: new AtCoder(),
  Codeforces: new Codeforces(),
  Hydro: new Hydro(),
  LeetCode: new LeetCode(),
  Luogu: new Luogu(),
  LibreOJ: new Lyrio(),
  MXOJ: new MXOJ(),
};
