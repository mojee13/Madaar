import { Link } from 'react-router-dom';
import { EmptyState } from '../components/UI';
export default function NotFoundPage() {
  return (
    <div className="container">
      <EmptyState
        title="این مسیر پیدا نشد"
        description="از کاتالوگ یا صفحه اصلی، مسیرتان را ادامه دهید."
      >
        <Link to="/" className="button button-primary">
          بازگشت به خانه
        </Link>
      </EmptyState>
    </div>
  );
}
