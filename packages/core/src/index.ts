export { scoreItem, scoreItems, summarizeScores } from './scoring/research-score';
export {
  canTransition,
  nextStates,
  LIFECYCLE_LABELS,
  type LifecycleStatus,
} from './lifecycle/product-lifecycle';
export {
  evaluateSpendLimits,
  decideAdAction,
  DEFAULT_AUTO_CONFIG,
  type SpendByPeriod,
  type LimitDef,
  type SpendViolation,
  type AdAction,
  type AdPerformance,
  type AutoModeConfig,
} from './guardrails/spend';
export {
  computeFinance,
  productProfit,
  type FinanceInputs,
  type FinanceComputed,
} from './finance/compute';
export {
  computeOperationScore,
  roasToScore,
  marginToScore,
  DEFAULT_OPERATION_WEIGHTS,
  type OperationScoreInputs,
  type OperationWeights,
} from './operation-score/compute';
