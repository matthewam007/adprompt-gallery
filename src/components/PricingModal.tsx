type PricingModalProps = {
  open: boolean;
  onClose: () => void;
  onSingleUnlock: () => void;
  onMembership: () => void;
};

export function PricingModal({ open, onClose, onSingleUnlock, onMembership }: PricingModalProps) {
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
        <div className="pricing-options">
          <article className="pricing-option pricing-option-single">
            <span>Single prompt</span>
            <h3>Unlock one prompt</h3>
            <strong>$5</strong>
            <p>For the one you came for.</p>
            <small>Includes full prompt, model notes, layout breakdown, and remix variables.</small>
            <button type="button" onClick={onSingleUnlock}>
              Unlock prompt
            </button>
          </article>
          <article className="pricing-option pricing-option-member">
            <span>Membership</span>
            <h3>Member access</h3>
            <strong>$20/mo</strong>
            <p>For people making ads every week.</p>
            <small>Unlock every prompt in the library, including new drops.</small>
            <button type="button" onClick={onMembership}>
              Get member access
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
