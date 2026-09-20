export type AdminRole = 'super_admin' | 'finance_admin' | 'risk_admin' | 'support_admin';

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  finance_admin: ['read_wallets', 'approve_rewards', 'export_audit'],
  risk_admin: ['read_risk_events', 'hold_rewards', 'reject_rewards'],
  support_admin: ['read_profiles', 'read_rounds', 'open_tickets'],
};

export type AuditAction =
  | 'created_campaign'
  | 'updated_game_limit'
  | 'approved_reward'
  | 'rejected_reward'
  | 'updated_game_version'
  | 'resolved_risk_event';

export function createAuditEntry(
  actorUserId: string,
  action: AuditAction,
  metadata: Record<string, string | number | boolean | null>,
) {
  return {
    actorUserId,
    action,
    metadata,
    createdAt: new Date().toISOString(),
  };
}
