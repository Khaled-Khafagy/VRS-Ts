export const SelfHealingConfig = {
    aiHealEnabled: process.env.AI_HEAL === 'true' && !!process.env.ANTHROPIC_API_KEY,
    aiHealRequested: process.env.AI_HEAL === 'true',
    autoHealPatch: process.env.AUTO_HEAL_PATCH === 'true',
    aiHealModel: process.env.AI_HEAL_MODEL ?? 'claude-haiku-4-5-20251001',
    fastCheckTimeoutMs: parseInt(process.env.HEAL_FAST_CHECK_TIMEOUT_MS ?? '2000'),
    aiMinConfidence: parseFloat(process.env.AI_HEAL_MIN_CONFIDENCE ?? '0.6'),
};
