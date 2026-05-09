type PricingModalProps = {
  open: boolean;
  onClose: () => void;
  onSingleUnlock: () => Promise<void>;
  onMembership: () => Promise<void>;
  loading?: "single" | "membership" | null;
  error?: string;
};

export function PricingModal({
  open,
  onClose,
  onSingleUnlock,
  onMembership,
  loading = null,
  error = "",
}: PricingModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Pricing">
      <div className="pricing-modal">
        <div className="modal-heading">
          <div>
            <h2>Keep the prompt</h2>
            <p>Choose the one you need today, or open the whole library.</p>
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close pricing">
            ×
          </button>
        </div>
        {error ? <p className="pricing-error">{error}</p> : null}
        <div className="pricing-options">
          <article className="pricing-option pricing-option-single">
            <span>Single prompt</span>
            <h3>Unlock one prompt</h3>
            <strong>$2</strong>
            <p>For the one you came for.</p>
            <small>Includes full prompt, model notes, layout breakdown, and remix variables.</small>
            <button type="button" onClick={onSingleUnlock} disabled={loading !== null}>
              {loading === "single" ? "Opening checkout..." : "Unlock prompt"}
            </button>
          </article>
          <article className="pricing-option pricing-option-member">
            <span>Membership</span>
            <h3>Member access</h3>
            <strong>$15/mo</strong>
            <p>For people making ads every week.</p>
            <small>Unlock every prompt in the library, including new drops.</small>
            <button type="button" onClick={onMembership} disabled={loading !== null}>
              {loading === "membership" ? "Opening checkout..." : "Get member access"}
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
