import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Product } from '../schemas/product.schema';
import Link from 'next/link';

export default function ProductCard({
  product,
}: {
  product: Omit<Product, 'price_history'>;
}) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="p-2">
        <CardHeader className="p-2 flex items-center justify-between">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500 text-ellipsis overflow-hidden max-w-[350px]">
              <span className="truncate">{product.url}</span>
            </CardDescription>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {product.current_price}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
