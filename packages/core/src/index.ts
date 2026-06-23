export { scoreItem, scoreItems, summarizeScores } from './scoring/research-score';
export {
  scoreOpportunity,
  computeSeasonality,
  computePriority,
  type OpportunitySignals,
  type OpportunityScore,
} from './opportunity/score';
export { scoreEvent, type EventSignals, type EventScore } from './event/score';
export {
  scoreProductIntelligence,
  type ProductIntelligenceSignals,
  type ProductIntelligenceScore,
} from './product-intelligence/score';
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
export {
  evaluateTrendAlarm,
  type TrendAlarmInput,
  type TrendAlarmResult,
} from './trend-alarm/score';
export {
  evaluateProductDemand,
  type ProductDemandInput,
  type ProductDemandResult,
} from './product-demand/score';
export {
  computeBehaviorScore,
  type BehaviorScoreInput,
  type BehaviorScoreResult,
} from './behavior/score';
export { parseIntent, ActionType, type Intent } from './action-router';
export {
  evaluateCompetitorAlarm,
  type CompetitorAlarmLevel,
  type CompetitorAlarmResult,
} from './competitor-alarm';
export {
  computeSupplierScore,
  type SupplierScoreInput,
  type SupplierScoreResult,
} from './supplier/score';
export {
  computeRiskScore,
  type RiskEngineInput,
  type RiskReport,
  type RiskSignal,
  type RiskLevel,
} from './risk-engine';
