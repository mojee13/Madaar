import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X, Presentation, ChevronDown, ChevronUp } from 'lucide-react';
import { tourSteps } from '../data/tour';
import { useTour } from '../hooks/useTour';
import { useDemo } from '../hooks/useDemo';
import { number } from '../utils/format';
export default function TourDock() {
  const { step, setStep } = useTour();
  const { state, setComparison, addToQuote } = useDemo();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  if (step === null) return null;
  const s = tourSteps[step];
  function go(n: number) {
    if (n === 4) {
      setComparison(['p01', 'p03']);
    }
    if (n === 5 && !state.quoteItems.length) addToQuote('p01');
    setStep(n);
    navigate(tourSteps[n].path);
  }
  return (
    <aside className="tour-dock" aria-label="راهنمای تور دمو">
      <div className="tour-dock-main">
        <span className="tour-dock-icon">
          <Presentation size={20} />
        </span>
        <div>
          <small>
            تور دمو · {number(step + 1)} از {number(tourSteps.length)}
          </small>
          <b>{s.title}</b>
        </div>
        <button
          className="icon-button"
          aria-label={expanded ? 'بستن نکته ارائه' : 'نمایش نکته ارائه'}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
        <div className="tour-dock-controls">
          <button
            className="icon-button"
            disabled={step === 0}
            onClick={() => go(step - 1)}
            aria-label="مرحله قبلی تور"
          >
            <ArrowRight size={18} />
          </button>
          {step < tourSteps.length - 1 ? (
            <button className="button button-primary button-small" onClick={() => go(step + 1)}>
              مرحله بعد
              <ArrowLeft size={16} />
            </button>
          ) : (
            <button
              className="button button-primary button-small"
              onClick={() => {
                setStep(null);
                navigate('/demo');
              }}
            >
              پایان تور
            </button>
          )}
          <button className="icon-button" onClick={() => setStep(null)} aria-label="خروج از تور">
            <X size={18} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="tour-presenter-tip">
          <b>نکته ارائه</b>
          <p>{s.tip}</p>
        </div>
      )}
      <div className="tour-progress-track">
        <span style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }} />
      </div>
    </aside>
  );
}
